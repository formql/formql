import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormQLModule } from '@formql/core';
import { FormQLEditorModule } from '@formql/editor';
import { FormQLMaterialModule } from '@formql/material';

import { DummyService } from './app-service';

import { HttpClientModule } from '@angular/common/http';
import { AppFormQLComponent } from './app-formql.component';

import { AppFormQLEditorComponent } from './app-formql-editor.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        AppFormQLComponent,
        AppFormQLEditorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormQLModule,
        FormQLEditorModule,
        FormQLMaterialModule,
        HttpClientModule,
        TextMaskModule,
        ReactiveFormsModule
    ],
    providers: [DummyService, { provide: 'FormQLService', useClass: DummyService }],
    bootstrap: [AppComponent]
})
export class AppModule { }
