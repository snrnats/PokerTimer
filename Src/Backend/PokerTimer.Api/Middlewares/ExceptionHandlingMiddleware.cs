using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using PokerTimer.Api.Exceptions;
using PokerTimer.Api.ViewModel;

namespace PokerTimer.Api.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IOptions<MvcJsonOptions> _jsonOptions;
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IOptions<MvcJsonOptions> jsonOptions)
        {
            _next = next;
            _logger = logger;
            _jsonOptions = jsonOptions;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (NotFoundException e)
            {
                if (!await TryWriteError(context, HttpStatusCode.NotFound, new ErrorResponse(e.Code, e.Message)))
                {
                    throw;
                }
            }
            catch (NoPermissionsException e)
            {
                if (!await TryWriteError(context, HttpStatusCode.Forbidden, new ErrorResponse(e.Code, e.Message)))
                {
                    throw;
                }
            }
            catch (ValidationException e)
            {
                if (!await TryWriteError(context, HttpStatusCode.UnprocessableEntity, new ValidationErrorResponse(e.Code, e.Message, e.ValidationErrors)))
                {
                    throw;
                }
            }
            catch (DomainException e)
            {
                if (!await TryWriteError(context, HttpStatusCode.UnprocessableEntity, new ErrorResponse(e.Code, e.Message)))
                {
                    throw;
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An unhandled exception has occurred");
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
            }
        }

        public async Task<bool> TryWriteError(HttpContext context, HttpStatusCode status, ErrorResponse e)
        {
            if (context.Response.HasStarted)
            {
                _logger.LogError("The response has already started, the http status code middleware will not be executed.");
                return false;
            }
            
            context.Response.StatusCode = (int) status;
            await context.Response.WriteAsync(JsonConvert.SerializeObject(e, _jsonOptions.Value.SerializerSettings));
            return true;
        }
    }
}