import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormQLModule } from '@formql/core';

import { LeftSideBarComponent } from "./components/left-side-bar.component";
import { TextMaskModule } from 'angular2-text-mask';
import { FormQLEditorComponent } from "./components/formql-editor.component";
import { TooltipComponent } from "./components/tooltip.component";
import { ComponentEditorComponent } from "./components/component-editor.component";
import { SectionEditorComponent } from "./components/section-editor.component";
import { PageEditorComponent } from "./components/page-editor.component";



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
        LeftSideBarComponent,
        ComponentEditorComponent,
        SectionEditorComponent,
        PageEditorComponent,

        FormQLEditorComponent,
        TooltipComponent
    ],
    entryComponents: [
        TooltipComponent,
        ComponentEditorComponent,
        SectionEditorComponent,
        PageEditorComponent

    ],
    exports: [
        FormQLEditorComponent
    ]
})
export class FormQLEditorModule { }

