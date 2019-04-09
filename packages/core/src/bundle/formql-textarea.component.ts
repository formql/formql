import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormComponent } from '../models/form-component.model';
import { FormValidator } from '../models/rule.model';


@Component({
    selector: 'formql-textbox',
    styleUrls: ['./formql-textarea.component.scss'],
    template: `<div *ngIf="formControl!=null">
        <label [attr.for]="field.componentId"
               [ngClass]="{'fql-bundle-label-required': field.rules?.required?.value}">{{field.label}}</label>
        <div>
            <textarea [id]="field.componentId" [formControl]="formControl" class="fql-bundle-field-input"
            [tabIndex]="tabIndex" [attr.disabled]="formControl.disabled ? '' : null">
            </textarea>
        </div>
        </div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLTextareaComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLTextareaComponent),
            multi: true
        }]
})
export class FormQLTextareaComponent implements ControlValueAccessor {
    static componentName = 'FormQLTextareaComponent';
    static formQLComponent = true;
    static validators = [
        <FormValidator>{
            name: 'Required',
            validator: Validators.required,
            key: 'required'
        }
    ];

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;
    @Input() tabIndex: string;

    private _value: string;
    private _propagateChange = (_: any) => { };

    constructor() {
    }

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
        this._propagateChange(this._value);
    }

    writeValue(value: string): void {
        if (value)
            this._value = value;
    }

    registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }
}
