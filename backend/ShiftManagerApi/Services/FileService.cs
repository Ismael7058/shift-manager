using ShiftManagerApi.Interfaces;

namespace ShiftManagerApi.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private const long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

        public FileService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveFile(IFormFile file, string folderPath)
        {
            var ext = Path.GetExtension(file.FileName);
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

            if (!allowedExtensions.Contains(ext, StringComparer.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Extension de archivo no permitida.");
            }


            if (file.Length > MAX_FILE_SIZE)
            {
                throw new InvalidOperationException("El archivo no puede superar los 10 MB.");
            }

            var directoryPath = Path.Combine(_env.WebRootPath, folderPath);

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var fileName = $"{Guid.NewGuid()}{ext}";

            var path = Path.Combine(directoryPath, fileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
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