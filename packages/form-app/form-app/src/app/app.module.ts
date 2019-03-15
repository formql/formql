import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormQLModule } from '@formql/core';
//import { FormQLModule } from '../../../../core/src/formql.module';
import { FormQLEditorModule } from '@formql/editor';
//import { FormQLEditorModule } from '../../../../editor/src/formql-editor.module';
import { FormQLMaterialModule } from '@formql/material'
//import { FormQLMaterialModule } from '../../../../material/src/formql-material.module';

import { DummyService } from './app-service';

import { HttpClientModule } from '@angular/common/http';
import { AppFormQLComponent } from './app-formql.component';

import { AppFormQLEditorComponent } from './app-formql-editor.component';
import { TextMaskModule } from 'angular2-text-mask';

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
    TextMaskModule
  ],
  providers: [DummyService, {provide: "FormQLService", useClass: DummyService }],
  bootstrap: [AppComponent]
})
export class AppModule { }
