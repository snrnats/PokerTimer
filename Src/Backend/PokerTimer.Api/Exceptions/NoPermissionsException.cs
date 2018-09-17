using System;

namespace PokerTimer.Api.Exceptions
{
    public class NoPermissionsException : DomainException
    {
        public NoPermissionsException(string message) : base(ErrorCode.NoPermissions, message)
        {
        }

        public NoPermissionsException(string message, Exception innerException) : base(ErrorCode.NoPermissions, message, innerException)
        {
        }
    }
}