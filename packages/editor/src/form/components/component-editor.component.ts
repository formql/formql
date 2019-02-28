import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormComponent, HelperService, ComponentProperties, FormQLMode } from '@formql/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser';

@Component({
    selector: '[component-editor]',
    templateUrl: './component-editor.component.html',
    styleUrls: ['./component-editor.component.scss']
})
export class ComponentEditorComponent implements OnInit {
    static componentName = "ComponentEditorComponent";

    @Input() component: FormComponent<any>;
    @Input() data: any;

    @Input() mode: FormQLMode;

    @Output() action = new EventEmitter<any>();

    updatedComponent: FormComponent<any>;

    disableSaveButton: boolean = false;

    constructor(
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        this.updatedComponent = <FormComponent<any>>{};
        this.updatedComponent = HelperService.deepCopy(this.component, ["value"]);
    }

    save() {
        HelperService.propertyCopy(this.updatedComponent, this.component, ["value"]);
        this.action.emit(this.component);
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
