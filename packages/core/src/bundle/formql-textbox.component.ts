import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators } from '@angular/forms';
import { FormComponent, ComponentValidator } from '../models/form-component.model';


@Component({
  selector: 'formql-textbox',
  template: `<div *ngIf="reactiveFormGroup!=null" [formGroup]="reactiveFormGroup">
  <label [attr.for]="field.componentId" [ngClass]="{'label-required': field.properties?.required?.value}">{{field.label}}</label>
  <div>
    <input [id]="field.componentId" [type]="field.type" 
        formControlName="{{field.componentId}}" style="width:100%" [tabIndex]="tabIndex"
        [attr.disabled]="field.properties?.readonly?.value ? '' : null">
  </div>
</div>`,
  styles: [`.label-required:after { content:" *"; color:red;}`,
           `input[type="text"] { width: 100%; box-sizing: border-box; -webkit-box-sizing:border-box; -moz-box-sizing: border-box;}`],
  providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormQLTextBoxComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => FormQLTextBoxComponent),
    multi: true
  }]
})
export class FormQLTextBoxComponent implements ControlValueAccessor {
  static componentName = 'FormQLTextBoxComponent';
  static formQLComponent = true;
  static validators = [
    <ComponentValidator> {
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
    if (value) {
			this._value = value;
		}
	}

	registerOnChange(fn: any): void {
		this._propagateChange = fn;
	}

	registerOnTouched(fn: any): void {}
}
