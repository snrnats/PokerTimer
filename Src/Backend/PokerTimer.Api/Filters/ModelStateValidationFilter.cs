using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;

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
                    context.Result = new BadRequestObjectResult("The request contains syntax erros and can't be parsed as JSON");
                }
                else
                {
                    context.Result = new UnprocessableEntityObjectResult(context.ModelState);
                }
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }
    }
}