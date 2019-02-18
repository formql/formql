import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import 'brace';
import 'brace/mode/text';
import 'brace/theme/github';
import 'brace/theme/xcode';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/graphqlschema';
import 'brace/ext/language_tools';

import { AceConfigInterface } from 'ngx-ace-wrapper';


@Component({
    selector: 'form-ace-editor',
    templateUrl: './form-ace-editor.component.html',
    styleUrls: ['./form-ace-editor.component.scss']
})
export class FormAceEditorComponent implements OnInit {

    @Input() value: string;
    @Input() label: string;
    @Input() mode: string;
    @Input() maxLines: number = 5;

    _value: string;

    @Output() valueChanged = new EventEmitter();

    public config: AceConfigInterface;

    constructor() {
        this.config = {
            mode: this.mode,
            theme: 'xcode',
            readOnly: false,
            showLineNumbers: false
        };
    }

    ngOnInit(): void {
        if (this.value)
            this._value = this.value;

        this.config.mode = this.mode;
        
        // this.config = {
        //   mode: this.mode,
        //   theme: 'xcode',
        //   readOnly : false,
        //   showLineNumbers: false,
        //   maxLines: this.maxLines
        // };
    }


    triggerValueChange(val) {
        this.valueChanged.emit(val);
    }

    getStyle() {
        return { 'height': String(this.maxLines * 10) + "px" };
    }

}