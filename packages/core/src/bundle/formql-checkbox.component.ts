import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { FormComponent } from '../models/form-component.model';
import { FormValidator } from '../models/rule.model';


@Component({
    selector: 'formql-checkbox',
    styleUrls: ['./formql-checkbox.component.scss'],
    template: `<div *ngIf="formControl!=null">
        <label [attr.for]="field.componentId"
               [ngClass]="{'fql-bundle-label-required': field.rules?.required?.value}">{{field.label}}</label>
            <div>
                <input [id]="field.componentId" type="checkbox"
                    [formControl]="formControl"
                    class="fql-bundle-checkbox-input" [tabIndex]="field.tabIndex"
                    [attr.disabled]="formControl.disabled ? '' : null">
            </div>
        </div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLCheckboxComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLCheckboxComponent),
            multi: true
        }]
})
export class FormQLCheckboxComponent implements ControlValueAccessor {

    static componentName = 'FormQLCheckboxComponent';
    static formQLComponent = true;
    static validators = [
        <FormValidator>{
            name: 'Required',
            validator: Validators.required,
            key: 'required'
        }
    ];

    @Input() field: FormComponent<boolean>;
    @Input() formControl: FormControl;

    private _value: boolean;

    private _propagateChange = (_: boolean) => { };

    get value(): boolean {

        return this._value;
    }

    set value(value: boolean) {
        this._value = value;
        this._propagateChange(this._value);
    }

    writeValue(value: boolean): void {
        if (value)
            this._value = value;
    }

    registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }
}
