import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService, Page, FormQLMode, ComponentValidator, ComponentProperty } from '@formql/core';

@Component({
    selector: '[page-editor]',
    templateUrl: './page-editor.component.html',
    styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent implements OnInit {
    static componentName = "PageEditorComponent";

    @Input() page: Page;
    @Input() data: any;
    @Input() mode: FormQLMode;
    @Output() action = new EventEmitter<any>();

    updatedPage: Page;
    disableSaveButton: boolean = false;
    validators: Array<ComponentValidator>;
    properties: Array<ComponentProperty>;

    ngOnInit() {
        this.updatedPage = <Page>{};
        this.updatedPage = HelperService.deepCopy(this.page, ["sections"]);
    }

    save() {
        HelperService.propertyCopy(this.updatedPage, this.page, ["sections"]);
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
