import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormQLModule, ComponentResolverService } from '@formql/core';
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
  providers: [
    ComponentResolverService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ComponentResolverService],
      useFactory: InitModule
    },
    DummyService, {provide: 'FormQLService', useClass: DummyService }],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function InitModule(componentResolverService: ComponentResolverService) {
  const x = () => {
      // Here you can register your custom component
      // e.g. componentResolverService.addComponent(...);
      componentResolverService.addComponent(AppFormQLChartComponent);
      componentResolverService.addComponent(AppFormQLMortgageScheduleComponent);
  };
  return x;
}
