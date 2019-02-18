import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsStoreModule } from './form/store/form-store.module';
import { FormService } from './form/services/form.service';
import { AppStoreModule } from './store/app-store.module';
import { FormQLInternalModule } from './form/formql-internal.module';
import { FormQLComponent } from './form/components/formql.component';



@NgModule({
  imports: [
    ComponentsStoreModule,
    FormQLInternalModule,
    ReactiveFormsModule, 
    AppStoreModule
  ],
  providers: [FormService],
  exports: [
      FormQLComponent
  ]
})
export class FormQLModule { }

