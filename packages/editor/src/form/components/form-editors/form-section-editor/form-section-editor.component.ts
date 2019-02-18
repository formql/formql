import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { FormDataSource } from '../../../models/model/form-window.model';
// import { FormComponent } from '../../../models/model/form-component.model';
// import { HelperService } from '../../../services/helper.service';
// import { FormSection } from '../../../models/model/form-section.model';
// import { FormStructureService } from '../../../services/form-structure.service';
// import { FormStructure } from '../../../models/structure/form-structure.model';

@Component({
  selector: 'form-section-editor',
  templateUrl: './form-section-editor.component.html',
  styleUrls: ['./form-section-editor.component.scss']
})
export class FormSectionEditorComponent implements OnInit {
  static componentName = "FormSectionEditorComponent";
  
  @Input() form: any;
//   @Input() component: FormSection;
  
  @Output() action = new EventEmitter<any>();

//   updatedSection: FormSection;

  loading: boolean = true;

//   newStructure: FormStructure;

  constructor(
    // private helperService: HelperService,
    // private structureService: FormStructureService
  ) { }   

  ngOnInit() {
    //   this.updatedSection = JSON.parse(JSON.stringify(this.component));
      
      this.loading = false;
  }

  save() {
    // if (this.component.structure != this.updatedSection.structure)
    // {
    //     this.newStructure = this.structureService.get(this.updatedSection.structure);

    //     if (this.newStructure && this.newStructure.rows && this.newStructure.rows.length > 0 &&
    //         this.newStructure.rows[0].columns && this.newStructure.rows[0].columns.length > 0 )
    //     {
    //         let id = this.newStructure.rows[0].columns[0].id;
    //         this.component.components.forEach(component => {
    //             component.position.column = id;
    //         });
    //     }

    // }
    
    // this.component.sectionName = this.updatedSection.sectionName;
    // this.component.sectionStyle = this.updatedSection.sectionStyle;
    // this.component.headerStyle = this.updatedSection.headerStyle;
    // this.component.structure = this.updatedSection.structure;
    // this.component.position.order = this.updatedSection.position.order;
    // this.component.position.column = this.updatedSection.position.column;

    
    
    // this.action.emit(this.component);
  }

  cancel() {
    this.action.emit();
  }
  
}
