using System;
using System.Net;

namespace PokerTimer.Api.Exceptions
{
    public class NotFoundException : DomainApiException
    {
        public NotFoundException(ErrorCode code, string message) : base(HttpStatusCode.NotFound, code, message)
        {
        }

        public NotFoundException(ErrorCode code, string message, Exception innerException) : base(HttpStatusCode.NotFound, code, message, innerException)
        {
        }
    }
}