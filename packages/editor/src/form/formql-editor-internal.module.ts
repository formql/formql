import { NgModule } from "@angular/core";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { CommonModule } from "@angular/common";

import { FormAdminComponent } from './components/form-admin/form-admin.component';
import { AppMaterialModule } from "./modules/app.material.module";
import { FormDatasourceEditorComponent } from "./components/form-editors/form-datasource-editor/form-datasource-editor.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TypeAheadDirective } from "./directives/typeahead.directive";
import { FormTypeaheadComponent } from "./components/form-typeahead/form-typeahead.component";

import { FormComponentEditorComponent } from "./components/form-editors/form-component-editor/form-component-editor.component";

import { FormSectionEditorComponent } from "./components/form-editors/form-section-editor/form-section-editor.component";
// import { FormQLComponent } from "./components/form-ql/form-ql.component";

import { FormEditorFieldInputComponent } from "./components/form-editors/form-editor-field-input/form-editor-field-input.component";
import { FormEditorJsonInputComponent } from "./components/form-editors/form-editor-json-input/form-editor-json-input.component";
import { FormComponentEditorSchemaComponent } from "./components/form-editors/form-component-editor/form-component-editor-schema/form-component-editor-schema.component";
import { FormComponentEditorMiscComponent } from "./components/form-editors/form-component-editor/form-component-editor-misc/form-component-editor-misc.component";
import { FormSectionValidatorComponent } from "./components/form-editors/form-section-editor/form-section-validator/form-section-validator.component";
import { AceModule, ACE_CONFIG, AceConfigInterface } from 'ngx-ace-wrapper';
import { FormAceEditorComponent } from "./components/form-ace-editor/form-ace-editor.component";

import { LeftSideBarComponent } from "./components/left-side-bar.component";
import { TextMaskModule } from 'angular2-text-mask';
import { FormQLEditorComponent } from "./components/formql-editor.component";
import { TooltipComponent } from "./components/tooltip.component";
import { ComponentEditorComponent } from "./components/component-editor.component";
import { SectionEditorComponent } from "./components/section-editor.component";


const DEFAULT_ACE_CONFIG: AceConfigInterface = {
  tabSize: 2
};

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AceModule,
    TextMaskModule 
  ],
  declarations: [
    
    FormAdminComponent,
    FormComponentEditorComponent,
    FormComponentEditorSchemaComponent,
    FormComponentEditorMiscComponent,
    FormDatasourceEditorComponent,
    TypeAheadDirective,
    FormTypeaheadComponent,
    FormSectionEditorComponent,
    FormEditorFieldInputComponent,
    FormEditorJsonInputComponent,
    FormSectionValidatorComponent,
    FormAceEditorComponent,
    LeftSideBarComponent,
    ComponentEditorComponent,
    SectionEditorComponent,
    // fields
    // FormQLComponent,

    FormQLEditorComponent,
    TooltipComponent
  ],
  entryComponents: [
    FormDatasourceEditorComponent, 
    FormComponentEditorComponent, 
    FormSectionEditorComponent,
    TooltipComponent,
    ComponentEditorComponent,
    SectionEditorComponent,
    // fields 
    FormEditorJsonInputComponent
  ],
  exports: [
    FormQLEditorComponent
  ],
  providers: []
})
export class FormQLEditorInternalModule { 
}