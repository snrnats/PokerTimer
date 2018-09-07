using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PokerTimer.Api.ViewModel
{
    public class ValidationErrorResponse:ErrorResponse
    {
        public ValidationErrorResponse(int code, string message) : base(code, message)
        {
        }


    }
}
