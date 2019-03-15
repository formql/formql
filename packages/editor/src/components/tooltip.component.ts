import { Component, Input, ViewContainerRef, Renderer2 } from '@angular/core';
import { WrapperType, InternalEventHandlerService, InternalEventType } from "@formql/core";

@Component({
    selector: '[tooltip]',
    template: `
        <div [ngClass]="[type == WrapperType.Component ? 'fql-editor-tooltip-center' : 'fql-editor-tooltip-section-center']">
            <div (mousedown)="onMouseDown($event)" class="fql-editor-tooltip-move"></div>
            <div (click)="editField()" class="fql-editor-tooltip-edit"></div>
            <div (click)="remove()" class="fql-editor-tooltip-close"></div>
        <div>
    `,
    styleUrls: ['./tooltip.component.scss']

})
export class TooltipComponent {
    static componentName = "TooltipComponent";

    @Input() wrapper: ViewContainerRef;
    @Input() object: any;
    @Input() type: WrapperType;

    public WrapperType = WrapperType;

    constructor(
        private internalEventHandlerService: InternalEventHandlerService,
        private renderer: Renderer2
    ) {}

    onMouseDown($event) {
        this.renderer.setAttribute(this.wrapper.element.nativeElement, "draggable", "true");
    }
    
    editField() {
        if (this.type == WrapperType.Component)
            this.internalEventHandlerService.send(InternalEventType.EditingComponent, this.object);
        else    
            this.internalEventHandlerService.send(InternalEventType.EditingSection, this.object);
    }

    remove() {
        let result = confirm(`Are you want to remove this ${this.type == WrapperType.Component ? "Component" : "Section"}?`);
        if (result)
        {
            if (this.type == WrapperType.Component)
                this.internalEventHandlerService.send(InternalEventType.RemoveComponent, this.object);
            else    
                this.internalEventHandlerService.send(InternalEventType.RemoveSection, this.object);
        }
    }

}
