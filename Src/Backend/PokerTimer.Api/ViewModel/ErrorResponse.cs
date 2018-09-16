using PokerTimer.Api.Exceptions;

namespace PokerTimer.Api.ViewModel
{
    public class ErrorResponse
    {
        public ErrorResponse(ErrorCode code, string message)
        {
            Code = code;
            Message = message;
        }

        public ErrorCode Code { get; }
        public string Message { get; }
    }
}