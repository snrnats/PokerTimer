using System;
using System.Net;

namespace PokerTimer.Api.Exceptions
{
    public class DomainApiException : DomainException
    {
        public DomainApiException(HttpStatusCode status, ErrorCode code, string message) : base(message)
        {
            Status = status;
            Code = code;
        }

        public DomainApiException(HttpStatusCode status, ErrorCode code, string message, Exception innerException) : base(message, innerException)
        {
            Status = status;
            Code = code;
        }

        public HttpStatusCode Status { get; }
        public ErrorCode Code { get; set; }
    }
}