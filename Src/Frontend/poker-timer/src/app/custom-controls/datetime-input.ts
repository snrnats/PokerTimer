import { Component, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatInput } from '@angular/material';

@Component({
    selector: 'app-datetime-input',
    template: `
    <input matInput [placeholder]="placeholder"
        type="datetime-local"
        (change)="update()"
        [value]="dateInput"/>`,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: DateTimeInputComponent, multi: true }]
})
export class DateTimeInputComponent implements ControlValueAccessor {
    @Input() placeholder: string;
    @ViewChild(MatInput) input: MatInput;

    dateInput: string;

    onChange: (value: any) => void;

    constructor(private datePipe: DatePipe) {
    }

    writeValue(value: any) {
        this.dateInput = value == null ? '' : this.datePipe.transform(value, 'yyyy-MM-dd');
    }

    registerOnChange(fn: (value: any) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: (value: any) => void) {
    }

    update() {
        this.onChange(this.input.value ? new Date(this.input.value) : '');
    }
}
