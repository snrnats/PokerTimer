using System.Collections.Generic;
using System.Collections.ObjectModel;
using PokerTimer.Api.Exceptions;
using PokerTimer.Api.Extensions;

namespace PokerTimer.Api.ViewModel
{
    public class ValidationErrorResponse : ErrorResponse
    {
        public ValidationErrorResponse(ErrorCode code, string message, IEnumerable<ValidationErrorItem> errors) : base(code, message)
        {
            Errors = errors.ToReadOnly();
        }

        public ReadOnlyCollection<ValidationErrorItem> Errors { get; }
    }
}