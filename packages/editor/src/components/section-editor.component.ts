import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService, FormQLMode, FormSection, FormValidator, FormRule } from '@formql/core';

@Component({
  selector: 'formql-section-editor',
  templateUrl: './section-editor.component.html',
  styleUrls: ['./section-editor.component.scss']
})
export class SectionEditorComponent implements OnInit {
  static componentName = 'SectionEditorComponent';

  @Input() section: FormSection;
  @Input() data: any;
  @Input() mode: FormQLMode;
  @Output() action = new EventEmitter<any>();

  updatedSection: FormSection;
  disableSaveButton = false;
  validators: Array<FormValidator>;
  properties: Array<FormRule>;

  ngOnInit() {
    this.updatedSection = <FormSection>{};
    this.updatedSection = HelperService.deepCopy(this.section, ['components']);
  }

  save() {
    this.section = HelperService.propertyCopy(this.updatedSection, this.section, ['components']);
    this.action.emit(this.section);
  }

  actionTriggered($event) {
    if ($event) this.save();
    else this.action.emit();
  }

  cancel() {
    this.action.emit();
  }
}
