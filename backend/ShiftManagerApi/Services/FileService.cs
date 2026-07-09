using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;

        public FileService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveFile(IFormFile archivo, string folderPath)
        {
            var destinatationFolder = Path.Combine(_env.WebRootPath, folderPath);

            if (!Directory.Exists(destinatationFolder))
            {
                Directory.CreateDirectory(destinatationFolder);
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(archivo.FileName)}";

            var path = Path.Combine(destinatationFolder, fileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await archivo.CopyToAsync(stream);
            }

            return fileName;
        }

        public async Task DeleteFile(string fileName, string folderPath)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return;
            }

            var path = Path.Combine(_env.WebRootPath, folderPath, fileName);

            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }
    }
}