import { Directive, HostListener, ViewContainerRef, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { FormQLMode } from '../models/formql-mode.model';
import { WrapperType } from '../models/wrapper-type.model';
import { DndTransfer } from '../models/dnd-transfer.model';


@Directive({
    selector: '[dnd]'
})
export class DndDirective {
    constructor(
        private view: ViewContainerRef,
        private renderer: Renderer2
    ) { }

    @Input() public sourceObjectId: string;
    @Input() public sourceWrapperId: string;
    @Input() public type: WrapperType;
    @Input() public mode: FormQLMode;

    @Output() synchronise: EventEmitter<any> = new EventEmitter();
    
    @HostListener('dragstart', ['$event']) public onDragStart($event) {
        if (this.mode != FormQLMode.View)
        {
            const draggabble = this.view.element.nativeElement.getAttribute("draggable");
            if (draggabble == "true" && $event && $event.dataTransfer && this.sourceObjectId)
            {
                $event.dataTransfer.effectAllowed = "move";
                const sourceIds = this.sourceObjectId + "#" + this.sourceWrapperId;
                $event.dataTransfer.setData("Text", sourceIds);
                
                // only way I found to support drag and drop in IE
                try { 
                    $event.dataTransfer.setData(this.type.toString(), ""); 
                } catch {
                    $event.dataTransfer.types.item[1] = this.type.toString();
                };
                
            }
        }
    }

    @HostListener('dragend', ['$event']) public onDragEnd($event) {
        if (this.mode != FormQLMode.View)
            this.renderer.setAttribute(this.view.element.nativeElement, "draggable", "false");
    }
}