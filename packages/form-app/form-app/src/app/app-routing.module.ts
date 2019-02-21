import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppFormQLComponent } from './app-formql.component';
import { AppFormQLEditorComponent } from './app-formql-editor.component';

const appRoutes: Routes = [
  { path: 'form/:name', component: AppFormQLComponent },
//   { path: 'form/:name/:id', component: AppFormQLComponent },
  { path: 'form/:name/edit', component: AppFormQLEditorComponent },

  { path: 'form/:name/:id/liveEdit', component: AppFormQLComponent }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true, useHash: true}
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
