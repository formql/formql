import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormQLModule } from '@formql/core';
// import { FormQLModule } from '../../../../core/src/formql.module';
import { FormQLEditorModule } from '@formql/editor';
// import { FormQLEditorModule } from '../../../../editor/src/modules/formql-editor.module';

import { DummyService } from './app-service';

import { HttpClientModule } from '@angular/common/http';
import { AppFormQLComponent } from './app-formql.component';

import { AppFormQLEditorComponent } from './app-formql-editor.component';

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
    HttpClientModule
  ],
  providers: [DummyService, {provide: "FormQLService", useClass: DummyService }],
  bootstrap: [AppComponent]
})
export class AppModule { }