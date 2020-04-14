import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormComponent } from '../models/form-component.model';
import { OptionValue, SelectList } from '../models/type.model';
import { FormValidator } from '../models/rule.model';


@Component({
    selector: 'formql-select',
    styleUrls: ['./formql-select.component.scss'],
    template: `<div *ngIf="formControl!=null">
        <label [attr.for]="field.componentId"
               [ngClass]="{'fql-bundle-label-required': field.rules?.required?.value}">{{field.label}}</label>
        <div>
            <select [formControl]="formControl" [id]="field.componentId"
                class="fql-bundle-field-input" [tabIndex]="field.tabIndex"
                [attr.multiple]="field.type === 'multiple'">
                <ng-container *ngIf="list">
                    <option *ngFor="let item of list" [value]="item.value">{{item.name}}</option>
                </ng-container>
            </select>
        </div>
        </div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLSelectComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLSelectComponent),
            multi: true
        }]
})
export class FormQLSelectComponent implements ControlValueAccessor, OnInit {

    static componentName = 'FormQLSelectComponent';
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
    list: Array<OptionValue>;

    private _propagateChange = (_: any) => { };

    ngOnInit() {
        if (this.field.configuration)
            this.list = (<SelectList>JSON.parse(this.field.configuration)).list;
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
