import { Directive, HostListener, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { FormQLMode, ContainerType } from '@formql/core';

/*
    Directive used for dragging new items into the editor
*/
@Directive({
    selector: '[formqlDndNew]'
})
export class DndNewDirective {
    constructor(
        private view: ViewContainerRef
    ) { }

    @Input() public sourceObjectId: string;
    @Input() public sourceWrapperId: string;
    @Input() public type: ContainerType;
    @Input() public mode: FormQLMode;

    @Output() synchronise: EventEmitter<any> = new EventEmitter();

    @HostListener('dragstart', ['$event']) public onDragStart($event) {
        if (this.mode !== FormQLMode.View) {
            const draggabble = this.view.element.nativeElement.getAttribute('draggable');
            if (draggabble === 'true' && $event && $event.dataTransfer) {
                $event.dataTransfer.effectAllowed = 'move';
                const sourceIds = 'new#' + this.type;
                $event.dataTransfer.setData('Text', sourceIds);

                // only way I found to support drag and drop in IE
                try {
                    $event.dataTransfer.setData(this.type.toString(), '');
                } catch {
                    $event.dataTransfer.types.item[1] = this.type.toString();
                }
            }
        }
    }
}