import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ComponentResolverService, FormQLModule } from '@formql/core';
import { TextMaskModule } from 'angular2-text-mask';
import { FormQLMatFormFieldComponent } from './components/formql-mat-form-field.component';
import { FormQLMatTextareaComponent } from './components/formql-mat-textarea.component';
import { FormQLMatCheckboxComponent } from './components/formql-mat-checkbox.component';
import { FormQLMatDatepickerComponent } from './components/formql-mat-datepicker.component';
import { FormQLMatButtonComponent } from './components/formql-mat-button.component';
import { FormQLInternalMaterialModule } from './formql-internal-material';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormQLModule,
        TextMaskModule,
        ReactiveFormsModule,
        CommonModule,
        FormQLInternalMaterialModule
    ],
    declarations: [
        FormQLMatFormFieldComponent,
        FormQLMatTextareaComponent,
        FormQLMatCheckboxComponent,
        FormQLMatDatepickerComponent,
        FormQLMatButtonComponent
    ],
    exports: [
    ],
    entryComponents: [
        FormQLMatFormFieldComponent,
        FormQLMatTextareaComponent,
        FormQLMatCheckboxComponent,
        FormQLMatDatepickerComponent,
        FormQLMatButtonComponent
    ]
})
export class FormQLMaterialModule { 
    public static registerComponents(componentResolverService: ComponentResolverService) {
        componentResolverService.addComponents(FormQLMatFormFieldComponent, FormQLMatTextareaComponent, 
            FormQLMatCheckboxComponent, FormQLMatDatepickerComponent, FormQLMatButtonComponent);
    }        
}