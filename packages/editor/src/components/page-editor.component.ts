import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService, FormPage, FormQLMode, ComponentValidator, ComponentProperty } from '@formql/core';

@Component({
    selector: 'formql-page-editor',
    templateUrl: './page-editor.component.html',
    styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent implements OnInit {
    static componentName = 'PageEditorComponent';

    @Input() page: FormPage;
    @Input() data: any;
    @Input() mode: FormQLMode;
    @Output() action = new EventEmitter<any>();

    updatedPage: FormPage;
    disableSaveButton = false;
    validators: Array<ComponentValidator>;
    properties: Array<ComponentProperty>;

    ngOnInit() {
        this.updatedPage = <FormPage>{};
        this.updatedPage = HelperService.deepCopy(this.page, ['sections']);
    }

    save() {
        this.page = HelperService.propertyCopy(this.updatedPage, this.page, ['sections']);
        this.action.emit(this.page);
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
