import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormQLModule } from '@formql/core';
import { FormQLEditorModule } from '@formql/editor';

import { DummyService } from './app-service';

import { HttpClientModule } from '@angular/common/http';
import { AppFormQLComponent } from './app-formql.component';

import { AppFormQLEditorComponent } from './app-formql-editor.component';
import { TextMaskModule } from 'angular2-text-mask';
import { AppTailwindTextFieldComponent } from './app-tailwind-text-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppTailwindLabelComponent } from './app-tailwind-label.component';
import { AppTailwindHeaderComponent } from './app-tailwind-header.component';
import { AppTailwindSelectFieldComponent } from './app-tailwind-select-field.component';

@NgModule({
    declarations: [
        AppComponent,
        AppFormQLComponent,
        AppFormQLEditorComponent,
        AppTailwindTextFieldComponent,
        AppTailwindLabelComponent,
        AppTailwindHeaderComponent,
        AppTailwindSelectFieldComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormQLModule,
        FormQLEditorModule,
        HttpClientModule,
        TextMaskModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        AppTailwindTextFieldComponent,
        AppTailwindLabelComponent,
        AppTailwindHeaderComponent,
        AppTailwindSelectFieldComponent
    ],
    providers: [DummyService, { provide: 'FormQLService', useClass: DummyService }],
    bootstrap: [AppComponent]
})
export class AppModule { }
