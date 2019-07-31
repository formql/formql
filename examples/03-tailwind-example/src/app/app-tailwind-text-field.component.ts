import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { FormComponent, FormValidator } from '@formql/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
    selector: 'app-tailwind-text-field',
    template: `
    <div class="mb-4">
      <label class="block mb-2" for="username">
        {{field.label}}
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
        [formControl]="formControl"
        [id]="field.componentId"
        [type]="field.type"
      >
    </div>
        `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AppTailwindTextFieldComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => AppTailwindTextFieldComponent),
            multi: true
        }]
})
export class AppTailwindTextFieldComponent implements OnInit, ControlValueAccessor {

    static componentName = 'AppTailwindTextFieldComponent';
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
    currencyMask: any;

    private _propagateChange = (_: any) => { };

    constructor() {}

    ngOnInit(): void {
        if (this.field && this.field.textMask)
            this.currencyMask = createNumberMask(this.field.textMask);
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
