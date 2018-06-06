import { ErrorStateMatcher } from "@angular/material";
import { FormGroupDirective, FormControl, NgForm } from "@angular/forms";

export class ImmediateErrorMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
        return !!(control && control.invalid );
    }
}
