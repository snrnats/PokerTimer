namespace PokerTimer.Api.Exceptions
{
    public class NotFoundException : DomainException
    {
        public NotFoundException(string message) : base(ErrorCode.NotFound, message)
        {
        }

        public NotFoundException(string message, Exception innerException) : base(ErrorCode.NotFound, message,
            innerException)
        {
        }
    }
}