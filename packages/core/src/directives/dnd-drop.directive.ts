import { Directive, HostListener, ViewContainerRef, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { FormQLMode } from '../models/formql-mode.model';
import { WrapperType } from '../models/wrapper-type.model';
import { ComponentPositionType } from '../models/form-component.model';
import { DndTransfer } from '../models/dnd.model';

/*
    Directive to handle the drop and receive the information from the dnd directive
*/
@Directive({
    selector: '[dnd-drop]'
})
export class DndDropDirective {
    constructor(
        private view: ViewContainerRef,
        private renderer: Renderer2
    ) { }

    @Input() public type: WrapperType;
    @Input() public positionType: ComponentPositionType;
    @Input() public mode: FormQLMode;

    @Output() synchronise: EventEmitter<any> = new EventEmitter();
    

    @HostListener('drop', ['$event']) public onDrop($event) {
        if (this.mode != FormQLMode.View && $event && 
            ($event.dataTransfer.types[1] === this.type.toString() || 
            ($event.dataTransfer.types.item && $event.dataTransfer.types.item[1] &&
            $event.dataTransfer.types.item[1] === this.type.toString())))
        {
            $event.stopPropagation();
            $event.preventDefault();
            const sourceIds = $event.dataTransfer.getData("Text");
            const arr = sourceIds.split("#");
            
            let targetIndexId = null;
            let element = this.getPositionElement($event.srcElement);
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
        if (this.mode != FormQLMode.View && $event)
        {
            if ($event.dataTransfer.types[1] === this.type.toString() ||
                ($event.dataTransfer.types.item && $event.dataTransfer.types.item[1] &&
                 $event.dataTransfer.types.item[1] === this.type.toString()))
            {
                $event.stopPropagation();
                $event.preventDefault();
                $event.dataTransfer.dropEffect = "move";
                
                this.renderer.setAttribute(this.view.element.nativeElement, "style", "border: 1px solid red");
                
                
                let element = this.getPositionElement($event.srcElement);
                if (element)
                    this.renderer.setAttribute(element, "style", "border-top: 1px solid blue;");
            }
        }
    }
   
    @HostListener('dragleave', ['$event']) public onDragLeave($event) {
        if (this.mode != FormQLMode.View && $event)
        {
            this.renderer.setAttribute(this.view.element.nativeElement, "style", "");
            
            let element = this.getPositionElement($event.srcElement);
            if (element)
                this.renderer.setAttribute(element, "style", "");
        
        }
    }

    getPositionElement(sourceELement) {
        let className = "fql-component-container";

        if (this.type == WrapperType.Section)
            className = "fql-section-wrapper-edit";
        
        let element = sourceELement;
        let i=0;
        while (element.className.indexOf(className) == -1 && i < 10)
        {
            element = element.parentElement;
            i++;
        }
        if (element.className.indexOf(className) != -1)
            return element
        
        return null;
    }

    getPositionAttribute(element) {
        let attributeName = "componentId";

        if (this.type == WrapperType.Section)
            attributeName = "sectionId";

        return element.getAttribute(attributeName);
    }


}