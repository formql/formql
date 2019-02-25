import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ComponentFactoryResolver, ViewContainerRef, Type } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, Validators } from '@angular/forms';
import { FormComponent, FormQLMode } from '@formql/core';
// import { HelperService } from '../../../../services/helper.service';

@Component({
    selector: 'form-component-editor-schema',
    templateUrl: './form-component-editor-schema.component.html',
    styleUrls: ['./form-component-editor-schema.component.scss']
})
export class FormComponentEditorSchemaComponent implements OnInit {
    static componentName = "FormComponentEditorSchemaComponent";

    @Input() component: FormComponent<any>;
    @Input() data: any;

    @Input() mode: FormQLMode;

    @Output() action = new EventEmitter<any>();

    valid: boolean = true;
    displayValidators: boolean = false;
    //   validators: Array<ComponentValidator>;
    //   properties: Array<ComponentProperty>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
    }

    ngOnInit() {
        // this.validators = Array<ComponentValidator>();
        // this.validators.push(<ComponentValidator>{ name: "Calculated Field", key: "value", validator: null });
        // this.validators.push(<ComponentValidator>{ name: "Hidden Condition", key: "hidden", validator: null });
        // this.validators.push(<ComponentValidator>{ name: "Read Only Condition", key: "readonly", validator: null });

        let factories = Array.from(this.componentFactoryResolver['_factories'].keys());
        // let type = factories.find((x: any)=>x.componentName == this.component.componentName);

        // if (type != null && type["validators"] != null)
        // {
        //   type["validators"].forEach(v=>{
        //     // this.validators.push(v);
        //   });
        // }

        // this.properties = Array<ComponentProperty>();

        // this.validators.forEach(v => {
        //   if (this.component.properties == null)
        //     this.component.properties = <ComponentProperties>{};

        //   let item = this.component.properties[v.key];
        //   if (item == undefined)
        //   {
        //     this.component.properties[v.key] = <ComponentProperty>{ key: v.key, condition: ""};
        //     this.properties.push(this.component.properties[v.key]);
        //   }
        //   else
        //     this.properties.push(item);
        // });
        this.displayValidators = true;
    }

    copyTextMask(value) {
        //   this.component.textMask = value;
    }


}
