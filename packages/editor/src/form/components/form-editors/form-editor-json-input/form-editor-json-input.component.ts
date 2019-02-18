import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
// import { HelperService } from '../../../services/helper.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'form-editor-json-input',
    templateUrl: './form-editor-json-input.component.html',
    styleUrls: ['./form-editor-json-input.component.scss']
})
export class FormEditorJsonInputComponent implements OnInit, OnChanges {
    static componentName = "FormEditorJsonInputComponent";
    field = new FormControl();

    previousValue: any;
    currentValue: any;
    firstChange: boolean;
    html: SafeHtml;
    error: string;
    _value: any;

    @Input() fieldLabel: string;
    @Input() value: any;
    @Input() data: any;
    @Input() valid: boolean;
    @Input() lines: number = 2;

    @Output() valueChange = new EventEmitter();
    @Output() validChange = new EventEmitter();


    labelId: string;

    show: boolean = true;

    constructor(
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        if (this.fieldLabel)
            this.labelId = this.fieldLabel.replace(/\s/g, "");

        if (this.value)
            this.value = JSON.stringify(this.value, null, '\t');
    }

    ngOnChanges(changes: SimpleChanges) {
        this._value = this.value;

    }

    valueChanged(value) {
        let jsonValue = '';
        try {
            jsonValue = JSON.parse(value);
            this.valueChange.emit(jsonValue);
        }
        catch (ex) {

        }


    }

}
