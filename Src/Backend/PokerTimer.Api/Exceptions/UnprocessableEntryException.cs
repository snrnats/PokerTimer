using System;
using System.Net;

namespace PokerTimer.Api.Exceptions
{
    public class UnprocessableEntryException : DomainApiException
    {
        public UnprocessableEntryException(ErrorCode code, string message) : base(HttpStatusCode.UnprocessableEntity, code, message)
        {
        }

        public UnprocessableEntryException(ErrorCode code, string message, Exception innerException) : base(HttpStatusCode.UnprocessableEntity, code, message, innerException)
        {
        }
    }
}