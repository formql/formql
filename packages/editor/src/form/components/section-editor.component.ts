import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { FormComponent, ComponentProperty, ComponentProperties } from '../../../models/model/form-component.model';
// import { HelperService } from '../../../services/helper.service';
import { FormComponent, HelperService, ComponentProperties, FormQLMode, Section, ComponentValidator, ComponentProperty } from '@formql/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser';


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

    constructor(
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        this.updatedSection = <Section>{};
        this.updatedSection = HelperService.deepCopy(this.section, ["components"]);
    }

    save() {
        HelperService.propertyCopy(this.updatedSection, this.section, ["components"]);
        this.action.emit(this.section);
    }

    getMessage(condition) {
        let data = JSON.parse(JSON.stringify(this.data));
        let response = HelperService.evaluateCondition(condition, data);
        let html = "";

        this.disableSaveButton = response.error ? true : false;

        html = "<div>Result: " + response.value + "</div>";

        if (response.error)
            html += "<div style='color:red'>" + response.error + "</div>";

        return this.sanitizer.bypassSecurityTrustHtml(html);
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
