import { Component, OnInit, Input, ViewContainerRef, Renderer2 } from '@angular/core';
import { WrapperType, FormComponent, EventHandlerService, EventType } from "@formql/core";

@Component({
    selector: '[tooltip]',
    template: `
        <div [ngClass]="[type == WrapperType.Component ? 'fql-editor-tooltip-center' : 'fql-editor-tooltip-section-center']">
            <div (mousedown)="onMouseDown($event)" class="fql-editor-tooltip-move"></div>
            <div (click)="editField()" class="fql-editor-tooltip-edit"></div>
            <div class="fql-editor-tooltip-close"></div>
        <div>
    `,
    styleUrls: ['./tooltip.component.scss']

})
export class TooltipComponent implements OnInit {
    static componentName = "TooltipComponent";

    @Input() wrapper: ViewContainerRef;
    @Input() object: any;
    @Input() type: WrapperType;

    public WrapperType = WrapperType;

    constructor(
        private eventHandlerService: EventHandlerService,
        private renderer: Renderer2
    ) {}

    ngOnInit() {
        
    }

    onMouseDown($event) {
        this.renderer.setAttribute(this.wrapper.element.nativeElement, "draggable", "true");
    }
    
    editField() {
        if (this.type == WrapperType.Component)
            this.eventHandlerService.send(EventType.EditingComponent, this.object);
        else    
            this.eventHandlerService.send(EventType.EditingSection, this.object);
    }

}
