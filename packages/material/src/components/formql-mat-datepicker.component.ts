import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators } from '@angular/forms';
import { FormComponent, ComponentValidator } from '@formql/core';

@Component({
  selector: 'formql-mat-datepicker',
  template: `<div *ngIf="reactiveFormGroup!=null" [formGroup]="reactiveFormGroup">
  <mat-form-field>
    <input [id]="field.componentId" matInput [matDatepicker]="picker" formControlName="{{field.componentId}}" [placeholder]="field.label" >
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
  </mat-form-field>
</div>`,
  providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormQLMatDatepickerComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => FormQLMatDatepickerComponent),
    multi: true
  }]
})
export class FormQLMatDatepickerComponent implements ControlValueAccessor {
  static componentName = 'FormQLMatDatepickerComponent';
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
