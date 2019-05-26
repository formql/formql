import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { FormComponent } from '../models/form-component.model';
import { createNumberMask, createAutoCorrectedDatePipe } from 'text-mask-addons';
import { HelperService } from '../services/helper.service';
import { FormValidator } from '../models/rule.model';


@Component({
    selector: 'formql-input',
    styleUrls: ['./formql-input.component.scss'],
    template: `<div *ngIf="formControl!=null">
        <label [attr.for]="field.componentId"
               [ngClass]="{'fql-bundle-label-required': field.rules?.required?.value}">{{field.label}}</label>
        <div>
            <input *ngIf="!mask" [id]="field.componentId" [type]="field.type"
                [formControl]="formControl" class="fql-bundle-field-input" [tabIndex]="field.tabIndex"
                [attr.disabled]="formControl.disabled ? '' : null">
            <input *ngIf="mask" [textMask]="{ mask: mask, guide: false}" [id]="field.componentId" type="text"
                [formControl]="formControl"
                class="fql-bundle-field-input" [tabIndex]="field.tabIndex"
                [attr.disabled]="formControl.disabled ? '' : null">
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
        <FormValidator>{
            name: 'Required',
            validator: Validators.required,
            key: 'required'
        }
    ];

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;

    private _value: string;
    public mask: any;


    ngOnInit() {
        if (this.field && this.field.textMask && this.field.type) {
            switch (this.field.type) {
                case 'number':
                    this.mask = createNumberMask(JSON.parse(this.field.textMask));
                break;

                case 'date':
                    this.mask = createAutoCorrectedDatePipe(this.field.textMask);
                break;

                case 'text':
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
    }

    writeValue(value: string): void {
        if (value)
            this._value = value;
    }

    registerOnChange(fn: any): void {}

    registerOnTouched(fn: any): void { }
}
