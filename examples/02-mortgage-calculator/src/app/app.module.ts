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
import { AppFormQLChartComponent } from './app-formql-chart.component';

import { ChartsModule } from 'ng2-charts';
import { AppFormQLMortgageScheduleComponent } from './app-formql-mortgage-schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    AppFormQLComponent,
    AppFormQLEditorComponent,
    AppFormQLChartComponent,
    AppFormQLMortgageScheduleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormQLModule,
    FormQLEditorModule,
    FormQLMaterialModule,
    HttpClientModule,
    TextMaskModule,
    ChartsModule
  ],
  entryComponents: [AppFormQLChartComponent, AppFormQLMortgageScheduleComponent],
  providers: [DummyService, {provide: 'FormQLService', useClass: DummyService }],
  bootstrap: [AppComponent]
})
export class AppModule { }
