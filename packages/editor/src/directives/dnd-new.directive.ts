import { Directive, HostListener, ViewContainerRef, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { FormQLMode, WrapperType } from '@formql/core';

/*
    Directive used for dragging new items into the editor
*/
@Directive({
    selector: '[dnd-new]'
})
export class DndNewDirective {
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
            if (draggabble == "true" && $event && $event.dataTransfer)
            {
                $event.dataTransfer.effectAllowed = "move";
                const sourceIds = "new#" + this.type;
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
}