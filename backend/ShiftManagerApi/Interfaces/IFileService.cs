namespace ShiftManagerApi.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveFile(IFormFile file, string folderPath);

        Task DeleteFile(string fileName, string folderPath);
    }
}
