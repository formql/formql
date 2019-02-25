import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormQLModule} from '@formql/core';
import { AppStoreModule } from '../store/app-store.module';
import { FormQLEditorInternalModule } from '../form/formql-editor-internal.module';
import { FormQLEditorComponent } from '../form/components/formql-editor.component';
import { AppMaterialModule } from '../form/modules/app.material.module';



@NgModule({
    imports: [
        BrowserModule,
        FormQLEditorInternalModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        AppStoreModule,
        FormQLModule,
        AppMaterialModule
    ],
    providers: [HttpClient],
    exports: [
        FormQLEditorComponent
    ]
})
export class FormQLEditorModule { }

