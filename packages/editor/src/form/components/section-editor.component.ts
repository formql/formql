import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService, FormQLMode, Section, ComponentValidator, ComponentProperty } from '@formql/core';

@Component({
    selector: '[section-editor]',
    templateUrl: './section-editor.component.html',
    styleUrls: ['./section-editor.component.scss']
})
export class SectionEditorComponent implements OnInit {
    static componentName = "SectionEditorComponent";

    @Input() section: Section;
    @Input() data: any;
    @Input() mode: FormQLMode;
    @Output() action = new EventEmitter<any>();

    updatedSection: Section;
    disableSaveButton: boolean = false;
    validators: Array<ComponentValidator>;
    properties: Array<ComponentProperty>;

    ngOnInit() {
        this.updatedSection = <Section>{};
        this.updatedSection = HelperService.deepCopy(this.section, ["components"]);
    }

    save() {
        HelperService.propertyCopy(this.updatedSection, this.section, ["components"]);
        this.action.emit(this.section);
    }

    
    actionTriggered($event) {
        if ($event)
            this.save();
        else
            this.action.emit();
    }

    cancel() {
        this.action.emit();
    }

    copyConfiguration(value)
    {
        // this.updatedComponent.configuration = value;
    }
}
