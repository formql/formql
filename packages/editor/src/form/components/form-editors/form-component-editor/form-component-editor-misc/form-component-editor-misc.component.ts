import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormComponent, FormQLMode } from '@formql/core';

@Component({
  selector: 'form-component-editor-misc',
  templateUrl: './form-component-editor-misc.component.html',
  styleUrls: ['./form-component-editor-misc.component.scss']
})
export class FormComponentEditorMiscComponent implements OnInit {
  static componentName = "FormComponentEditorMiscComponent";
  
  @Input() component: FormComponent<any>;
  @Input() data: any;
  
  @Input() mode: FormQLMode;
  
  @Output() action = new EventEmitter<any>();

  disableSaveButton: boolean = false;

  loading: boolean = true;

  constructor(
  ) { 
  }   

  ngOnInit() {
  }

  save() {
    //this.action.emit(this.component);
  }

  cancel() {
    this.action.emit();
  }
}
