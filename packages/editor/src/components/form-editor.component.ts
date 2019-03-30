import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService, FormQLMode, FormWindow } from '@formql/core';

@Component({
    selector: 'formql-form-editor',
    templateUrl: './form-editor.component.html',
    styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
    static componentName = 'FormEditorComponent';

    @Input() form: FormWindow;
    @Input() data: any;
    @Input() mode: FormQLMode;
    @Output() action = new EventEmitter<any>();

    updatedForm: FormWindow;
    disableSaveButton = false;

    ngOnInit() {
        this.updatedForm = <FormWindow>{};
        this.updatedForm = HelperService.deepCopy(this.form, ['pages']);
    }

    save() {
        this.form = HelperService.propertyCopy(this.updatedForm, this.form, ['pages']);
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
