using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using PokerTimer.Api.ViewModel;

namespace PokerTimer.Api.Filters
{
    public class ModelStateValidationFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var isInvalidJsonFormat = context.ModelState.Values.Any(entry => entry.Errors.Any(error => error.Exception is JsonException));
                if (isInvalidJsonFormat)
                {
                    context.Result = new BadRequestObjectResult("The request contains syntax errors and can't be parsed as JSON");
                }
                else
                {
                    var validationErrors = context.ModelState
                        .Where(pair => pair.Value.ValidationState == ModelValidationState.Invalid)
                        .SelectMany(pair => pair.Value.Errors.Select(error => new ValidationErrorItem(pair.Key, error.ErrorMessage))).ToArray();
                    throw new Exceptions.ValidationException(validationErrors.First().Message, validationErrors);
                }
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }
    }
}