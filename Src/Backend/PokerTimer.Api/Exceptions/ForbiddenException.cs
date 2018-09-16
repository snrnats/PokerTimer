using System;
using System.Net;

namespace PokerTimer.Api.Exceptions
{
    public class ForbiddenException : DomainApiException
    {
        public ForbiddenException(ErrorCode code, string message) : base(HttpStatusCode.Forbidden, code, message)
        {
        }

        public ForbiddenException(ErrorCode code, string message, Exception innerException) : base(HttpStatusCode.Forbidden, code, message, innerException)
        {
        }
    }
}