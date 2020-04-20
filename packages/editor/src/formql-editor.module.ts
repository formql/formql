import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentResolverService, FormQLModule } from '@formql/core';

import { LeftSideBarComponent } from './components/left-side-bar.component';
import { TextMaskModule } from 'angular2-text-mask';
import { FormQLEditorComponent } from './components/formql-editor.component';
import { TooltipComponent } from './components/tooltip.component';
import { ComponentEditorComponent } from './components/component-editor.component';
import { SectionEditorComponent } from './components/section-editor.component';
import { PageEditorComponent } from './components/page-editor.component';
import { FormEditorComponent } from './components/form-editor.component';
import { DndNewDirective } from './directives/dnd-new.directive';
import { GridStyleEditorComponent } from './components/grid-style-editor.component';
import { JsonFieldInputComponent } from './components/json-field-input.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TextMaskModule,
        FormsModule,
        FormQLModule,
        TextMaskModule
    ],
    declarations: [
        GridStyleEditorComponent,
        JsonFieldInputComponent,
        LeftSideBarComponent,
        ComponentEditorComponent,
        SectionEditorComponent,
        PageEditorComponent,
        FormEditorComponent,
        FormQLEditorComponent,
        TooltipComponent,
        DndNewDirective
    ],
    entryComponents: [
        TooltipComponent,
        ComponentEditorComponent,
        SectionEditorComponent,
        PageEditorComponent,
        FormEditorComponent
    ],
    exports: [
        FormQLEditorComponent,
        GridStyleEditorComponent,
        JsonFieldInputComponent
    ]
})
export class FormQLEditorModule { 
    constructor(componentResolverService: ComponentResolverService) {
        componentResolverService.addComponents(
            TooltipComponent,
            ComponentEditorComponent,
            SectionEditorComponent,
            PageEditorComponent,
            FormEditorComponent
        );
    }
}
