import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
    static optionalValidation(controlName: string, validateIf: (value: any) => boolean, validator: ValidatorFn): ValidatorFn {
        const thus = this;
        return (control: AbstractControl): ValidationErrors | null => {
            let relativeControl: AbstractControl = this["relativeControl"];
            if (!relativeControl) {
                relativeControl = this.findControl(control, controlName);
                this["relativeControl"] = relativeControl;
                relativeControl.valueChanges.subscribe((s) => {
                    control.updateValueAndValidity();
                });
            }

            if (validateIf(relativeControl.value)) {
                return validator(control);
            }

            // Validation is passed if relative control is invalid
            return null;
        };
    }

    private static findControl(sourceControl: AbstractControl, targetControlName: string): AbstractControl {
        let control = sourceControl;
        while (control) {
            const targetControl = control.get(targetControlName);
            if (targetControl) {
                return targetControl;
            }
            control = control.parent;
        }
        return null;
    }
}