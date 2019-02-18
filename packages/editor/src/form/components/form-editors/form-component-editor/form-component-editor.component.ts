import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { FormComponent, ComponentProperty, ComponentProperties } from '../../../models/model/form-component.model';
// import { HelperService } from '../../../services/helper.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser';


@Component({
    selector: 'form-component-editor',
    templateUrl: './form-component-editor.component.html',
    styleUrls: ['./form-component-editor.component.scss']
})
export class FormComponentEditorComponent implements OnInit {
    static componentName = "FormComponentEditorComponent";

    // @Input() component: FormComponent<any>;
    @Input() data: any;

    @Input() liveEdit: boolean;

    @Output() action = new EventEmitter<any>();

    // updatedComponent: FormComponent<any>;

    disableSaveButton: boolean = false;

    loading: boolean = true;

    step: Number = 0;

    constructor(
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        // this.updatedComponent = <FormComponent<any>>{};
        // this.updatedComponent = this.copyComponent(this.updatedComponent, this.component);
        this.loading = false;
    }

    save() {
        // this.component = this.copyComponent(this.component, this.updatedComponent);
        // this.action.emit(this.component);
    }

    getMessage(condition) {
        let data = JSON.parse(JSON.stringify(this.data));
        // let response = HelperService.evaluateCondition(condition, data);
        let html = "";

        // this.disableSaveButton = response.error ? true : false;

        // html = "<div>Result: " + response.value + "</div>";

        // if (response.error)
        //     html += "<div style='color:red'>" + response.error + "</div>";

        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    // copyComponent(response: FormComponent<any>, component: FormComponent<any>) {
    //     response.schema = component.schema;
    //     response.label = component.label;
    //     response.componentName = component.componentName;
    //     response.tabIndex = component.tabIndex;
    //     response.configuration = component.configuration;
    //     response.type = component.type;
    //     response.textMask = component.textMask;
        
    //     if (response.properties == null)
    //         response.properties = <ComponentProperties>{};

    //     if (component.properties != null) {
    //         Object.keys(component.properties).forEach(key => {
    //             if (component.properties[key] != undefined && !HelperService.isNullOrEmpty(component.properties[key].condition))
    //                 response.properties[key] = JSON.parse(JSON.stringify(component.properties[key]));
    //             else
    //                 delete response.properties[key];
    //         });
    //     }
    //     else
    //         response.properties = null;

    //     return response;
    // }

    setStep(index: number) {
        this.step = index;
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
