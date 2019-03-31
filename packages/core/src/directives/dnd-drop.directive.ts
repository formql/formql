import { Directive, HostListener, ViewContainerRef, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { DndTransfer } from '../models/dnd.model';
import { ContainerType, FormQLMode } from '../models/type.model';
import { GridPositionType } from '../models/style.model';
/*
    Directive to handle the drop and receive the information from the dnd directive
*/
@Directive({
    selector: '[formqlDndDrop]'
})
export class DndDropDirective {
    constructor(
        private view: ViewContainerRef,
        private renderer: Renderer2
    ) { }

    @Input() public type: ContainerType;
    @Input() public positionType: GridPositionType;
    @Input() public mode: FormQLMode;

    @Output() synchronise: EventEmitter<any> = new EventEmitter();

    @HostListener('drop', ['$event']) public onDrop($event) {
        if (this.mode !== FormQLMode.View && $event &&
            ($event.dataTransfer.types[1] === this.type.toString() ||
            ($event.dataTransfer.types.item && $event.dataTransfer.types.item[1] &&
            $event.dataTransfer.types.item[1] === this.type.toString())))
        {
            $event.stopPropagation();
            $event.preventDefault();
            const sourceIds = $event.dataTransfer.getData('Text');
            const arr = sourceIds.split('#');

            let targetIndexId = null;
            const element = this.getPositionElement($event.srcElement);
            if (element)
                targetIndexId = this.getPositionAttribute(element);

            this.synchronise.emit(<DndTransfer>{
                sourceObjectId: arr[0],
                sourceWrapperId: arr[1],
                targetIndexId: targetIndexId 
            });
        }
    }

    @HostListener('dragover', ['$event']) public onDragOver($event) {
        if (this.mode !== FormQLMode.View && $event)
        {
            if ($event.dataTransfer.types[1] === this.type.toString() ||
                ($event.dataTransfer.types.item && $event.dataTransfer.types.item[1] &&
                 $event.dataTransfer.types.item[1] === this.type.toString()))
            {
                $event.stopPropagation();
                $event.preventDefault();
                $event.dataTransfer.dropEffect = 'move';

                this.renderer.setAttribute(this.view.element.nativeElement, 'style', 'border: 1px solid red');

                const element = this.getPositionElement($event.srcElement);
                if (element)
                    this.renderer.setAttribute(element, 'style', 'border-top: 1px solid blue;');
            }
        }
    }

    @HostListener('dragleave', ['$event']) public onDragLeave($event) {
        if (this.mode !== FormQLMode.View && $event)
        {
            this.renderer.setAttribute(this.view.element.nativeElement, 'style', '');

            const element = this.getPositionElement($event.srcElement);
            if (element)
                this.renderer.setAttribute(element, 'style', '');
        }
    }

    getPositionElement(sourceELement) {
        let className = 'fql-component-container';

        if (this.type === ContainerType.Section)
            className = 'fql-section-wrapper-edit';

        let element = sourceELement;
        let i = 0;
        while (element.className && element.className.indexOf(className) === -1 && i < 10) {
            element = element.parentElement;
            i++;
        }

        if (element.className && element.className.indexOf(className) !== -1)
            return element;

        return null;
    }

    getPositionAttribute(element) {
        let attributeName = 'componentId';

        if (this.type === ContainerType.Section)
            attributeName = 'sectionId';

        return element.getAttribute(attributeName);
    }
}
