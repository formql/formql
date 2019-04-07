import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { FormComponent, FormValidator } from '@formql/core';

@Component({
    selector: 'formql-mat-textarea',
    template: `<div *ngIf="formControl!=null">
  <mat-form-field style="width: 100%">
    <textarea [id]="field.componentId"
        [type]="field.type" [formControl]="formControl" matInput [placeholder]="field.label"></textarea>
  </mat-form-field>
</div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLMatTextareaComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLMatTextareaComponent),
            multi: true
        }]
})
export class FormQLMatTextareaComponent implements ControlValueAccessor {
    static componentName = 'FormQLMatTextareaComponent';
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
