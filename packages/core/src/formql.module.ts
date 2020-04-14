import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PlainLayoutComponent } from './components/layouts/plain-layout.component';
import { PageWrapperComponent } from './components/page-wrapper.component';
import { SectionWrapperComponent } from './components/section-wrapper.component';
import { ComponentContainerComponent } from './components/component-container.component';

import { LayoutDirective } from './directives/layout.directive';
import { DndDirective } from './directives/dnd.directive';

import { FormQLComponent } from './components/formql.component';
import { FormQLButtonComponent } from './bundle/formql-button.component';
import { TextMaskModule } from 'angular2-text-mask';

import { FormQLLabelComponent } from './bundle/formql-label.component';
import { FormQLInputComponent } from './bundle/formql-input.component';
import { DndDropDirective } from './directives/dnd-drop.directive';
import { FormQLTextareaComponent } from './bundle/formql-textarea.component';
import { FormQLSelectComponent } from './bundle/formql-select.component';
import { FormQLRadioComponent } from './bundle/formql-radio.component';
import { FormQLCheckboxComponent } from './bundle/formql-checkbox.component';
import { LayoutLoaderComponent } from './components/layout-loader.component';

import { ComponentResolverService } from './services/component-resolver.service';

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
    SectionWrapperComponent,
    ComponentContainerComponent,
    FormQLComponent,
    LayoutLoaderComponent,

    // directives
    LayoutDirective,
    DndDirective,
    DndDropDirective,

    // bundle
    FormQLButtonComponent,
    FormQLInputComponent,
    FormQLLabelComponent,
    FormQLTextareaComponent,
    FormQLSelectComponent,
    FormQLRadioComponent,
    FormQLCheckboxComponent
  ],
  providers: [
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
    FormQLTextareaComponent,
    FormQLSelectComponent,
    FormQLRadioComponent,
    FormQLCheckboxComponent
  ],
  exports: [
      FormQLComponent
  ]
})
export class FormQLModule {
  public static registerComponents(componentResolverService: ComponentResolverService) {
    componentResolverService.addComponents(
      FormQLComponent,
      PlainLayoutComponent,
      FormQLButtonComponent,
      FormQLInputComponent,
      FormQLLabelComponent,
      FormQLTextareaComponent,
      FormQLSelectComponent,
      FormQLRadioComponent,
      FormQLCheckboxComponent      
    );
  }    
}
