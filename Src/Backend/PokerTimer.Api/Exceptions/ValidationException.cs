using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using PokerTimer.Api.Extensions;
using PokerTimer.Api.ViewModel;

namespace PokerTimer.Api.Exceptions
{
    public class ValidationException : DomainException
    {
        public ReadOnlyCollection<ValidationErrorItem> ValidationErrors { get; set; }

        public ValidationException(string message, IEnumerable<ValidationErrorItem> errors) : base(ErrorCode.ValidationError, message)
        {
            ValidationErrors = errors.ToReadOnly();
        }

        public ValidationException(string message, IEnumerable<ValidationErrorItem> errors, Exception innerException) : base(ErrorCode.ValidationError, message, innerException)
        {
            ValidationErrors = errors.ToReadOnly();
        }
    }
}