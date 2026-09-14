using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ShiftManagerApi.Data;
using ShiftManagerApi.Dtos;
using ShiftManagerApi.Entity;
using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
  public class ServiceService : IServiceService
  {
    private readonly ShiftManagerContext _context;
    private readonly IFileService _fileService;
    private const string FOLDER_PATH = "Uploads/Services";

    public ServiceService(ShiftManagerContext context, IFileService fileService)
    {
      _context = context;
      _fileService = fileService;
    }

    public async Task<PaginatedDto<ServiceDto>> GetAll(ServiceFilterDto filter)
    {
      var query = _context.Service.AsNoTracking().AsQueryable();

      if (!string.IsNullOrWhiteSpace(filter.Name))
        query = query.Where(u => u.Name.ToLower().Contains(filter.Name.ToLower()));

      // Filtrar por duracion
      if (filter.MinDurationMinutes.HasValue)
        query = query.Where(u => u.DurationMinutes >= filter.MinDurationMinutes);
      if (filter.MaxDurationMinutes.HasValue)
        query = query.Where(u => u.DurationMinutes <= filter.MaxDurationMinutes);

      if (filter.IsActive == 1 || filter.IsActive == 0)
        query = query.Where(u => u.IsActive == (filter.IsActive == 0 ? false : true));

      var totalCount = await query.CountAsync();

      query = filter.SortBy?.ToLower() switch
      {
        "name" => filter.IsDescending ? query.OrderByDescending(u => u.Name) : query.OrderBy(u => u.Name),
        _ => filter.IsDescending ? query.OrderByDescending(u => u.Id) : query.OrderBy(u => u.Id)
      };

      var services = await query
        .Skip((filter.PageNumber - 1) * filter.PageSize)
        .Take(filter.PageSize)
        .Select(s => new ServiceDto
        {
          Id = s.Id,
          Name = s.Name,
          Description = s.Description,
          DurationMinutes = s.DurationMinutes,
          IsActive = s.IsActive,
          Images = s.Images.Select(img => new ServiceImageDto
          {
            Id = img.Id,
            ServiceId = img.ServiceId,
            ImageUrl = img.ImageUrl
          }).ToList()
        }).ToListAsync();
      return new PaginatedDto<ServiceDto>
      {
        Items = services,
        TotalCount = totalCount,
        PageNumber = filter.PageNumber,
        PageSize = filter.PageSize
      };
    }

    public async Task<ServiceDto> GetById(long id)
    {
      var service = await _context.Service
        .Include(s => s.Images)
        .FirstOrDefaultAsync(s => s.Id == id);

      if (service == null) throw new KeyNotFoundException("Servicio no encontrado");

      var serviceDto = new ServiceDto
      {
          Id = service.Id,
          Name = service.Name,
          Description = service.Description,
          DurationMinutes = service.DurationMinutes,
          IsActive = service.IsActive,
          Images = service.Images.Select(img => new ServiceImageDto
          {
            Id = img.Id,
            ServiceId = img.ServiceId,
            ImageUrl = img.ImageUrl
          }).ToList()
      };
      return serviceDto;
    }

    public async Task<ServiceDto> CreateService(CreateServiceDto createServiceDto)
    {
      var service = new Service
      {
        Name = createServiceDto.Name,
        Description = createServiceDto.Description,
        DurationMinutes = createServiceDto.DurationMinutes,
        IsActive = true
      };

      _context.Service.Add(service);
      await _context.SaveChangesAsync();

      return new ServiceDto
      {
        Id = service.Id,
        Name = service.Name,
        Description = service.Description,
        DurationMinutes = service.DurationMinutes,
        IsActive = service.IsActive
      };
    }

    public async Task UpdateService(long id, UpdateServiceDto updateServiceDto)
    {
      var service = await _context.Service.FirstOrDefaultAsync(p => p.Id == id);

      if (service == null) throw new UnauthorizedAccessException("Servicio no encontrados");

      service.Name = updateServiceDto.Name;
      service.Description = updateServiceDto.Description;
      service.DurationMinutes = updateServiceDto.DurationMinutes;

      await _context.SaveChangesAsync();
    }

    public async Task IsActive(long id, UpdateStatusDto statusDto)
    {
      var service = await _context.Service.FirstOrDefaultAsync(p => p.Id == id);

      if (service == null) throw new UnauthorizedAccessException("Servicio no encontrados");

      service.IsActive = statusDto.IsActive;

      await _context.SaveChangesAsync();
    }

    public async Task<List<ServiceImageDto>> AddImages(long serviceId, List<IFormFile> files)
    {
      var service = await _context.Service.FirstOrDefaultAsync(s => s.Id == serviceId);
      if (service == null)
        throw new KeyNotFoundException("Servicio no encontrado");

      if (files == null || files.Count == 0)
        throw new InvalidOperationException("No se enviaron archivos para guardar");

      var createdImages = new List<ServiceImage>();

      foreach (var file in files)
      {
        if (file != null && file.Length > 0)
        {
          var fileName = await _fileService.SaveFile(file, FOLDER_PATH);
          var serviceImage = new ServiceImage
          {
            ServiceId = serviceId,
            ImageUrl = $"/{FOLDER_PATH}/{fileName}"
          };
          createdImages.Add(serviceImage);
        }
      }

      if (createdImages.Count > 0)
      {
        await _context.ServiceImages.AddRangeAsync(createdImages);
        await _context.SaveChangesAsync();
      }

      return createdImages.Select(img => new ServiceImageDto
      {
        Id = img.Id,
        ServiceId = img.ServiceId,
        ImageUrl = img.ImageUrl
      }).ToList();
    }

    public async Task DeleteImage(long serviceId, long imageId)
    {
      var serviceImage = await _context.ServiceImages
        .FirstOrDefaultAsync(img => img.Id == imageId && img.ServiceId == serviceId);

      if (serviceImage == null)
        throw new KeyNotFoundException("Imagen no encontrada para el servicio especificado");

      var fileName = Path.GetFileName(serviceImage.ImageUrl);

      _context.ServiceImages.Remove(serviceImage);
      await _context.SaveChangesAsync();

      if (!string.IsNullOrEmpty(fileName))
      {
        await _fileService.DeleteFile(fileName, FOLDER_PATH);
      }
    }
  }
}