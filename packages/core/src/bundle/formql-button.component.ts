
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { FormComponent } from '../models/form-component.model';
import { ActionHandlerService } from '../services/action-handler.service';
import { FormAction, FormActionType } from '../models/action.model';

@Component({
    selector: 'formql-button',
    template: `<button style="cursor: pointer" (click)="onClick()"
                    [type]="field.type"
                    [disabled]="formControl.disabled ||
                    (field.type === 'submit' &&
                    this.formControl.parent.parent.parent.invalid) ? true : null">{{field.label}}</button>`,
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
    static actions = [
        <FormAction>{
            key: FormActionType.Save
        },
        <FormAction>{
            key: FormActionType.Validate
        },
        <FormAction>{
            key: FormActionType.ValidateAndSave
        },
        <FormAction>{
            key: FormActionType.Custom
        }
    ];

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;

    private _value: string;
    private _propagateChange = (_: any) => { };

    constructor(
        private actionHandlerService: ActionHandlerService
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
        if (value)
            this._value = value;
    }

    registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }

    onClick() {
        if (this.field.action)
            this.actionHandlerService.send(this.field.action);
    }

}
