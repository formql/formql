import { Component, OnInit, Input, Output, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import { FormComponent, HelperService, ComponentProperties, FormQLMode, ComponentProperty, ComponentValidator } from '@formql/core';

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
    componentList: Array<any>;
    validators: Array<ComponentValidator>;
    properties: Array<ComponentProperty>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        this.componentList = Array.from(this.componentFactoryResolver['_factories'].keys())
                .filter((x:any)=>x.formQLComponent)
                .map((x:any)=>x.componentName)
                .filter((x, index, self) => index == self.indexOf(x))
                .sort();
    }

    ngOnInit() {
        this.updatedComponent = <FormComponent<any>>{};
        this.updatedComponent = HelperService.deepCopy(this.component, ["value"]);
        // if (this.updatedComponent.textMask)
        //     this.updatedComponent.textMask.replace('\\\\', '\\');

        this.loadValidators();
    }

    save() {
        HelperService.propertyCopy(this.updatedComponent, this.component, ["value"]);
        // if (this.updatedComponent.textMask)
        //     this.updatedComponent.textMask.replace('\\', '\\\\');
            
        this.action.emit(this.component);
    }

    getResult(condition) {
        let response = HelperService.evaluateCondition(condition, this.data);
        return response.value;
    }
    
    getError(condition) {
        let response = HelperService.evaluateCondition(condition, this.data);
        return response.error;
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

    loadValidators() {
        this.validators = Array<ComponentValidator>();
        this.validators.push(<ComponentValidator>{ name: "Calculated Field", key: "value", validator: null });
        this.validators.push(<ComponentValidator>{ name: "Hidden Condition", key: "hidden", validator: null });
        this.validators.push(<ComponentValidator>{ name: "Read Only Condition", key: "readonly", validator: null });
        
        let factories = Array.from(this.componentFactoryResolver['_factories'].keys());
        let type = factories.find((x: any)=>x.componentName == this.component.componentName);

        if (type != null && type["validators"] != null)
        {
          type["validators"].forEach(v=>{
            this.validators.push(v);
          });
        }

        this.properties = Array<ComponentProperty>();

        this.validators.forEach(v => {
          if (this.updatedComponent.properties == null)
            this.updatedComponent.properties = <ComponentProperties>{};

          let item = this.updatedComponent.properties[v.key];
          if (item == undefined)
          {
            this.updatedComponent.properties[v.key] = <ComponentProperty>{ key: v.key, condition: ""};
            this.properties.push(this.updatedComponent.properties[v.key]);
          }
          else
            this.properties.push(item);
        });
    }
}