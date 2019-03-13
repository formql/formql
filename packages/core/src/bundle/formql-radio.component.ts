import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators } from '@angular/forms';
import { FormComponent, ComponentValidator } from '../models/form-component.model';
import { createNumberMask, createAutoCorrectedDatePipe } from 'text-mask-addons';
import { HelperService } from '../services/helper.service';
import { OptionValue, SelectList } from '../models/types.model';


@Component({
    selector: 'formql-radio',
    template: `<div *ngIf="reactiveFormGroup!=null" [formGroup]="reactiveFormGroup">
        <label [attr.for]="field.componentId" [ngClass]="{'label-required': field.properties?.required?.value}">{{field.label}}</label>    
        <div class="fql-field-input">    
            <label *ngFor="let item of list" class="fql-radio">
                <input type="radio" [value]="item.value" formControlName="{{field.componentId}}">{{item.name}}
            </label>
        </div>
    </div>`,
    styles: [`.label-required:after { content:" *"; color:red;}`,
        `.fql-radio { cursor: pointer }`],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLRadioComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLRadioComponent),
            multi: true
        }]
})
export class FormQLRadioComponent implements ControlValueAccessor, OnInit {

    static componentName = 'FormQLRadioComponent';
    static formQLComponent = true;
    static validators = [
        <ComponentValidator>{
            name: "Required",
            validator: Validators.required,
            key: "required"
        }
    ];

    @Input() field: FormComponent<any>;
    @Input() reactiveFormGroup: FormGroup;
    @Input() tabIndex: string;

    private _value: string;
    private _propagateChange = (_: any) => { };

    list: Array<OptionValue>;

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
        if (value) {
            this._value = value;
        }
    }

    registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }
}
