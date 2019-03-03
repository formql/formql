import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormQLModule} from '@formql/core';
import { FormQLEditorInternalModule } from '../form/formql-editor-internal.module';
import { FormQLEditorComponent } from '../form/components/formql-editor.component';


@NgModule({
    imports: [
        FormQLEditorInternalModule,
        ReactiveFormsModule,
        FormsModule,
        FormQLModule
    ],
    exports: [
        FormQLEditorComponent
    ]
})
export class FormQLEditorModule { }

