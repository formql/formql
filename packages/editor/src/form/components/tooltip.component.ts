import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { WrapperType } from "@formql/core";

@Component({
    selector: '[tooltip]',
    template: `
        <div [ngClass]="[type == WrapperType.Component ? 'fql-editor-tooltip-center' : 'fql-editor-tooltip-section-center']">
            <div (mousedown)="onMouseDown($event)" class="fql-editor-tooltip-move"></div>
            <div class="fql-editor-tooltip-edit"></div>
            <div class="fql-editor-tooltip-close"></div>
        <div>
    `,
    styleUrls: ['./tooltip.component.scss']

})
export class TooltipComponent implements OnInit {
    static componentName = "TooltipComponent";

    @Input() wrapper: ViewContainerRef;
    @Input() type: WrapperType;

    public WrapperType = WrapperType;

    ngOnInit() {
        
    }

    onMouseDown($event) {
        // do the right way
        //this.renderer.setAttribute(this.wrapper.nativeElement, "draggable", "true");

        this.wrapper.element.nativeElement.setAttribute("draggable", "true");
    }
    
    editField() {
        
    }

}
