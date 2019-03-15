import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators } from '@angular/forms';
import { FormComponent, ComponentValidator } from '@formql/core';

@Component({
  selector: 'formql-mat-checkbox',
  template:`<div *ngIf="reactiveFormGroup!=null" [formGroup]="reactiveFormGroup">
  <mat-checkbox [id]="field.componentId" formControlName="{{field.componentId}}">{{field.label}}</mat-checkbox>
  <mat-error *ngIf="!reactiveFormGroup.controls[field.componentId].valid && reactiveFormGroup.controls[field.componentId].touched">
   </mat-error>
</div>`,
  providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormQLMatCheckboxComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => FormQLMatCheckboxComponent),
    multi: true
  }]
})
export class FormQLMatCheckboxComponent implements ControlValueAccessor {
  static componentName = 'FormQLMatCheckboxComponent';
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
