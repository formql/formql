import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FormService } from './services/form.service';
import { PlainLayoutComponent } from './components/layouts/plain-layout.component';
import { PageWrapperComponent } from './components/page-wrapper.component';
import { PageContainerComponent } from "./components/page-container.component";
import { SectionWrapperComponent } from './components/section-wrapper.component';
import { SectionContainerComponent } from './components/section-container.component';
import { ComponentContainerComponent } from './components/component-container.component';

import { LayoutDirective } from './directives/layout.directive';
import { DndDirective } from "./directives/dnd.directive";

import { FormQLComponent } from "./components/formql.component";
import { FormQLButtonComponent } from "./bundle/formql-button.component";
import { TextMaskModule } from 'angular2-text-mask';

import { FormQLLabelComponent } from "./bundle/formql-label.component";
import { FormQLInputComponent } from "./bundle/formql-input.component";
import { DndDropDirective } from "./directives/dnd-drop.directive";
import { FormQLTextareaComponent } from './bundle/formql-textarea.component';




@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    TextMaskModule
  ],
  declarations: [
    
    // components
    PlainLayoutComponent,
    PageWrapperComponent,
    PageContainerComponent,
    SectionWrapperComponent,
    SectionContainerComponent,
    ComponentContainerComponent,
    FormQLComponent,

    // directives
    LayoutDirective,
    DndDirective,
    DndDropDirective,
    
    // bundle
    FormQLButtonComponent,
    FormQLInputComponent,
    FormQLLabelComponent,
    FormQLTextareaComponent
  ],
  entryComponents: [
    // formql
    FormQLComponent,
    
    // layouts
    PlainLayoutComponent, 
    
    // fields 
    FormQLButtonComponent,
    FormQLInputComponent,
    FormQLLabelComponent,
    FormQLTextareaComponent
  ],
  providers: [FormService],
  exports: [
      FormQLComponent
  ]
})
export class FormQLModule { }

