import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, Validators } from '@angular/forms';
import { FormComponent, ComponentValidator } from '../models/form-component.model';


@Component({
  selector: 'formql-textbox',
  styleUrls: ["./formql-textarea.component.scss"],
  template: `<div *ngIf="reactiveFormGroup!=null" [formGroup]="reactiveFormGroup">
        <label [attr.for]="field.componentId" [ngClass]="{'fql-bundle-label-required': field.properties?.required?.value}">{{field.label}}</label>
        <div>
            <textarea [id]="field.componentId" formControlName="{{field.componentId}}" class="fql-bundle-field-input" 
            [tabIndex]="tabIndex" [attr.disabled]="field.properties?.readonly?.value ? '' : null">
            </textarea>
        </div>
        </div>`,
  providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormQLTextareaComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => FormQLTextareaComponent),
    multi: true
  }]
})
export class FormQLTextareaComponent implements ControlValueAccessor {
  static componentName = 'FormQLTextareaComponent';
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
