import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService, FormQLMode, FormWrapper } from '@formql/core';

@Component({
    selector: '[form-editor]',
    templateUrl: './form-editor.component.html',
    styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
    static componentName = "FormEditorComponent";

    @Input() form: FormWrapper;
    @Input() data: any;
    @Input() mode: FormQLMode;
    @Output() action = new EventEmitter<any>();

    updatedForm: FormWrapper;
    disableSaveButton: boolean = false;
    
    ngOnInit() {
        this.updatedForm = <FormWrapper>{};
        this.updatedForm = HelperService.deepCopy(this.form, ["pages"]);
    }

    save() {
        HelperService.propertyCopy(this.updatedForm, this.form, ["pages"]);
        this.action.emit(this.form);
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
}
