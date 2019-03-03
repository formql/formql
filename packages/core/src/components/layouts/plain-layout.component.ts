import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormWrapper } from '../../models/form-wrapper.model';
import { FormGroup } from '@angular/forms';
import { FormQLMode } from '../../models/formql-mode.model';

@Component({
  selector: 'plain-layout',
  template: `<ng-container *ngIf="form!=null && form.pages!= null && form.pages.length > 0">
  <form [formGroup]="reactiveForm">
    <div pageWrapper *ngIf="form.pages!=null"
      [(page)]="form.pages[0]"
      [reactivePage]="reactiveForm.controls[form.pages[0].pageId]"
      [formGroupName]="form.pages[0].pageId"
      [mode]="mode"></div>
  </form>
</ng-container>`
})
export class PlainLayoutComponent implements OnInit {
  static componentName = 'PlainLayoutComponent'; 

  @Input() public form: FormWrapper;
  @Input() public reactiveForm: FormGroup;
  @Input() public mode: FormQLMode;
  
  constructor() { }

  ngOnInit() {
    
  }
}
