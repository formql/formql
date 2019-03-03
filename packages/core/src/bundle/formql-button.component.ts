
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators } from '@angular/forms';
import { FormComponent, ComponentValidator } from '../models/form-component.model';
import { EventHandlerService } from '../services/event-handler.service';
import { EventType } from '../models/event-handler.model';



@Component({
    selector: 'formql-button',
    template: `<button mat-flat-button color="primary" 
    class="float-right" (click)="onClick()">{{field.label}}</button>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLButtonComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLButtonComponent),
            multi: true
        }]
})

export class FormQLButtonComponent implements ControlValueAccessor {
    static componentName = 'FormQLButtonComponent';
    static formQLComponent = true;
    static validators = [];

    @Input() field: FormComponent<any>;
    @Input() reactiveFormGroup: FormGroup;

    private _value: string;
    private _propagateChange = (_: any) => { };

    constructor(
        private eventHandlerService: EventHandlerService
    ) {
    }

    get value(): any {

        return this._value;
    }

    set value(value: any) {
        this._value = value;
        this._propagateChange(this._value);
    }

    writeValue(value: string): void {
        if (value) {
            this._value = value;
        }
    }

    registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }

    onClick() {
        this.eventHandlerService.send(EventType.SubmitForm, null);
    }

}
