import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
// import { HelperService } from '../../../services/helper.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'form-editor-field-input',
    templateUrl: './form-editor-field-input.component.html',
    styleUrls: ['./form-editor-field-input.component.scss']
})
export class FormEditorFieldInputComponent implements OnInit, OnChanges {
    static componentName = "FormComponentEditorComponent";
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
    @Input() mode: string;
    @Input() maxLines: string;
    @Input() validate: boolean = true;

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
    }

    ngOnChanges(changes: SimpleChanges) {
        this._value = this.value;

    }

    valueChanged(value) {
        this.valueChange.emit(value);
        if (this.value != value) {
            let response = { value: false, error: null };
            if (this.validate) {
                // response = HelperService.evaluateCondition(value, this.data);
                // let html = "";

                // this.valid = response.error ? false : true;

                // html = "<div>Result: " + response.value + "</div>";

                // if (response.error) {
                //     this.error = response.error;
                //     this.field.setErrors({ 'incorrect': true });
                // }
                // else {
                //     this.error = null;
                //     this.field.setErrors(null);
                // }
                // this.html = this.sanitizer.bypassSecurityTrustHtml(html);
            }
            this.valueChange.emit(value);
            this.validChange.emit(this.valid);
        }
    }

}
