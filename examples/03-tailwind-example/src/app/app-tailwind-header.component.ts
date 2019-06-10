import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormComponent } from '@formql/core';

@Component({
    selector: 'app-tailwind-header',
    template: `<h2 class="font-normal text-2xl text-grey-darkest leading-loose my-3 w-full">{{field.label}}</h2>`,
})
export class AppTailwindHeaderComponent {
    static componentName = 'AppTailwindHeaderComponent';
    static formQLComponent = true;
    static validators = [];

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;
}
