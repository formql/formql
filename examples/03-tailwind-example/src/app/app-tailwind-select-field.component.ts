import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { FormComponent, FormValidator } from '@formql/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
    selector: 'app-tailwind-select-field',
    template: `
    <div class="mb-4">
        <label class="block mb-2" [for]="field.componentId">
            {{field.label}}
        </label>
        <div class="relative">
            <select class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                [id]="field.componentId" required>
                    <option disabled selected>Choose...</option>
                    <option>New Mexico</option>
                    <option>Missouri</option>
                    <option>Texas</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
            </div>
        </div>
    </div>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AppTailwindSelectFieldComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => AppTailwindSelectFieldComponent),
            multi: true
        }]
})
export class AppTailwindSelectFieldComponent implements OnInit, ControlValueAccessor {

    static componentName = 'AppTailwindSelectFieldComponent';
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
