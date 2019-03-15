import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators } from '@angular/forms';
import { FormComponent, ComponentValidator } from '../models/form-component.model';
import { createNumberMask, createAutoCorrectedDatePipe } from 'text-mask-addons';
import { HelperService } from '../services/helper.service';


@Component({
    selector: 'formql-input',
    styleUrls: ["./formql-input.component.scss"],
    template: `<div *ngIf="reactiveFormGroup!=null" [formGroup]="reactiveFormGroup">
        <label [attr.for]="field.componentId" [ngClass]="{'fql-bundle-label-required': field.properties?.required?.value}">{{field.label}}</label>
        <div>
            <input *ngIf="!mask" [id]="field.componentId" [type]="field.type" 
                formControlName="{{field.componentId}}" class="fql-bundle-field-input" [tabIndex]="tabIndex"
                [attr.disabled]="field.properties?.readonly?.value ? '' : null">
            <input *ngIf="mask" [textMask]="{ mask: mask, guide: false}" [id]="field.componentId" type="text" 
                formControlName="{{field.componentId}}" 
                class="fql-bundle-field-input" [tabIndex]="tabIndex"
                [attr.disabled]="field.properties?.readonly?.value ? '' : null">
        </div>
        </div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLInputComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLInputComponent),
            multi: true
        }]
})
export class FormQLInputComponent implements ControlValueAccessor, OnInit {

    static componentName = 'FormQLInputComponent';
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

    public mask: any;

    ngOnInit() {
        if (this.field && this.field.textMask && this.field.type)
        {
            switch(this.field.type)
            {
                case "number":
                    this.mask = createNumberMask(JSON.parse(this.field.textMask));
                break;

                case "date":
                    this.mask = createAutoCorrectedDatePipe(this.field.textMask);
                break;

                case "text":
                    this.mask = HelperService.maskToArray(this.field.textMask);
                break;
            }
        }
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
