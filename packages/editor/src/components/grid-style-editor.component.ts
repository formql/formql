import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridStyle } from '@formql/core';

@Component({
    selector: 'grid-style-editor',
    templateUrl: './grid-style-editor.component.html',
    styleUrls: ['./grid-style-editor.component.scss']
})
export class GridStyleEditorComponent {
    static componentName = "GridStyleEditorComponent";

    @Input() gridStyle: GridStyle;
    @Input() header: string;

    message: string;
    
    get styleValue() {
        return JSON.stringify(this.gridStyle.style,null,2);
    }

    set styleValue(v) {
        try {
            this.gridStyle.style = JSON.parse(v);
            this.message = "";
        }
        catch (ex)
        {
            this.message = "Invalid Json!";
        }
    }
}
