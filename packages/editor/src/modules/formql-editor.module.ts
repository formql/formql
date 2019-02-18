import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppStoreModule } from '../store/app-store.module';
import { FormQLEditorInternalModule } from '../form/formql-editor-internal.module';
import { FormQLEditorComponent } from '../form/components/formql-editor.component';
// import { FormQLModule } from '../../../core/src/formql.module';
import { FormQLModule, FormQLComponent} from '@formql/core';


@NgModule({
    imports: [
        BrowserModule,
        FormQLEditorInternalModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        AppStoreModule,
        FormQLModule
    ],
    providers: [HttpClient],
    exports: [
        FormQLEditorComponent
    ]
})
export class FormQLEditorModule { }

