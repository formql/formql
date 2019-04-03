import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'formql-json-field-input',
    template: `<label class="fql-field-label" for="json">{{label}}</label>
        <textarea class="fql-field-textarea" name="json" id="json" [rows]="rows" [(ngModel)]="styleValue"></textarea>
        <span style="color:red">{{message}}</span>`,
    styleUrls: ['./grid-style-editor.component.scss']
})
export class JsonFieldInputComponent {
    static componentName = 'JsonFieldInputComponent';

    @Input() label: string;
    @Input() json: any;
    @Input() rows = '4';

    @Output() jsonChange = new EventEmitter();

    message: string;

    get styleValue() {
        if (this.json)
            return JSON.stringify(this.json, null, 2);
        else
            return;
    }

    set styleValue(value) {
        try {
            if (value)
                this.json = JSON.parse(value);
            else
                this.json = null;

            this.jsonChange.emit(this.json);
            this.message = '';
        } catch (ex) {
            this.message = ex;
        }
    }
}
