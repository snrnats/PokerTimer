using System;

namespace PokerTimer.Api.Exceptions
{
    public class DomainException : ApplicationException
    {
        public DomainException(ErrorCode code, string message) : base(message)
        {
            Code = code;
        }

        public DomainException(ErrorCode code, string message, Exception innerException) : base(message, innerException)
        {
            Code = code;
        }

        public ErrorCode Code { get; set; }
    }
}