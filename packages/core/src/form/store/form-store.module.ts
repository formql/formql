import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FormStoreService } from './form-store.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { formStoreReducer } from './form.reducers';
import { FormEffects } from './form.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    StoreModule.forFeature('formStore', formStoreReducer),
     StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      //logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forFeature([FormEffects])
  ],
  exports: [StoreModule, EffectsModule],
  providers: [FormStoreService]
})
export class ComponentsStoreModule { }