import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators } from '@angular/forms';
import { FormComponent, ComponentValidator } from '../models/form-component.model';


@Component({
  selector: 'formql-label',
  template: `<div *ngIf="field" style="border-bottom: solid 1px">
        <label>{{field.label}}</label>
        </div>`,
  providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormQLLabelComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => FormQLLabelComponent),
    multi: true
  }]
})
export class FormQLLabelComponent implements ControlValueAccessor {
  static componentName = 'FormQLLabelComponent';
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
