namespace PokerTimer.Api.Exceptions
{
    public class ValidationErrorItem
    {
        public ValidationErrorItem(string path, string message)
        {
            Path = path;
            Message = message;
        }

        public string Path { get; }
        public string Message { get; }
    }
}