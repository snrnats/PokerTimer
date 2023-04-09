using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PokerTimer.Api.Exceptions;
using PokerTimer.Api.ViewModel;

namespace PokerTimer.Api.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
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
            var response = new ErrorResponse(e.Code, e.Message);
            await context.Response.WriteAsync(JsonConvert.SerializeObject(response));
            return true;
        }
    }
}