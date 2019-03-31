
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '../models/form-component.model';
import { ActionHandlerService } from '../services/action-handler.service';
import { FormAction, ActionType } from '../models/action.model';

@Component({
    selector: 'formql-button',
    template: `<button style="cursor: pointer" (click)="onClick()"
                [disabled]="field.rules?.readonly?.value ? true : null">{{field.label}}</button>`,
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
            key: ActionType.Submit
        }
    ];

    @Input() field: FormComponent<any>;
    @Input() reactiveFormGroup: FormGroup;

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
        if (this.field.actions) {
            const arr = Object.keys(this.field.actions);
            if (arr && arr[0]) {
                const action = <FormAction>this.field.actions[arr[0]];
                if (action.key === ActionType.Custom)
                    this.actionHandlerService.send(action.customkey, action.parameters);
                else
                    this.actionHandlerService.send(action.key, action.parameters);
            }
        }
    }

}
