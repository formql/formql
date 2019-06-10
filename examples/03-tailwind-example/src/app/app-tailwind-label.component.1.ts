import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormComponent } from '@formql/core';

@Component({
    selector: 'app-tailwind-button',
    template: `<button>{{field.label}}</button>`,
})
export class AppTailwindLabelComponent {
    static componentName = 'AppTailwindLabelComponent';
    static formQLComponent = true;
    static validators = [];

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;
}
