import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ComponentFactoryResolver, ViewContainerRef, Type } from '@angular/core';
// import { FormComponent, ComponentValidator, ComponentProperty, ComponentProperties } from '../../../../models/model/form-component.model';
// import { FormSection } from '../../../../models/model/form-section.model';

@Component({
  selector: 'form-section-validator',
  templateUrl: './form-section-validator.component.html',
  styleUrls: ['./form-section-validator.component.scss']
})
export class FormSectionValidatorComponent implements OnInit {
  static componentName = "FormSectionValidatorComponent";

//   @Input() component: FormSection;
  @Input() data: any;

  @Input() liveEdit: boolean;

  @Output() action = new EventEmitter<any>();

  valid: boolean = true;
  displayValidators: boolean = false;
//   validators: Array<ComponentValidator>;
//   properties: Array<ComponentProperty>;
  value: string = "asd";
  
  constructor(
  ) {
  }

  valueChanged(value) {
    
  }

  ngOnInit() {
    // this.validators = Array<ComponentValidator>();
    // this.validators.push(<ComponentValidator>{ name: "Hidden Condition", key: "hidden", validator: null });
    
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
  
  save() {
    // this.action.emit(this.component);
  }

  cancel() {
    this.action.emit();
  }
}
