import { Directive, EventEmitter, HostListener, Input, Output, Renderer2, ViewContainerRef } from '@angular/core';
import { DndTransfer } from '../models/dnd.model';
import { GridPositionType } from '../models/style.model';
import { ContainerType, FormQLMode } from '../models/type.model';
/*
    Directive to handle the drop and receive the information from the dnd directive
*/
@Directive({
  selector: '[formqlDndDrop]'
})
export class DndDropDirective {
  constructor(private view: ViewContainerRef, private renderer: Renderer2) {}

  @Input() public type: ContainerType;
  @Input() public positionType: GridPositionType;
  @Input() public mode: FormQLMode;

  @Output() synchronise: EventEmitter<any> = new EventEmitter();

  dropAreaClass = 'fql-dnd-container-drop-area';
  dropSeparatorBorderClass = 'fql-dnd-container-separator';

  @HostListener('drop', ['$event']) public onDrop($event) {
    if (
      this.mode !== FormQLMode.View &&
      $event &&
      ($event.dataTransfer.types[1] === this.type.toString() ||
        ($event.dataTransfer.types.item &&
          $event.dataTransfer.types.item[1] &&
          $event.dataTransfer.types.item[1] === this.type.toString()))
    ) {
      $event.stopPropagation();
      $event.preventDefault();
      const sourceIds = $event.dataTransfer.getData('Text');
      const arr = sourceIds.split('#');

      let targetIndexId = null;
      const element = this.getPositionElement($event.srcElement);
      if (element) targetIndexId = this.getPositionAttribute(element);

      this.synchronise.emit(<DndTransfer>{
        sourceObjectId: arr[0],
        sourceWrapperId: arr[1],
        targetIndexId: targetIndexId
      });
    }
  }

  @HostListener('dragover', ['$event']) public onDragOver($event) {
    if (this.mode !== FormQLMode.View && $event)
      if (
        $event.dataTransfer.types[1] === this.type.toString() ||
        ($event.dataTransfer.types.item &&
          $event.dataTransfer.types.item[1] &&
          $event.dataTransfer.types.item[1] === this.type.toString())
      ) {
        $event.stopPropagation();
        $event.preventDefault();
        $event.dataTransfer.dropEffect = 'move';

        const nativeElement = this.view.element.nativeElement;
        const currentDropAreaBorderClasses = nativeElement.getAttribute('class') ? nativeElement.getAttribute('class').trim() : '';

        if (currentDropAreaBorderClasses.indexOf(this.dropAreaClass) === -1) {
          const newDropAreaClasses = `${currentDropAreaBorderClasses} ${this.dropAreaClass}`;
          this.renderer.setAttribute(nativeElement, 'class', newDropAreaClasses);
        }

        const element = this.getPositionElement($event.srcElement);
        if (element) {
          const currentDropSeparatorBoderStyle = element.getAttribute('class') ? element.getAttribute('class').trim() : '';
          if (currentDropSeparatorBoderStyle.indexOf(this.dropSeparatorBorderClass) === -1) {
            const newDropSeparatorBorderStyling = `${currentDropSeparatorBoderStyle} ${this.dropSeparatorBorderClass}`;
            this.renderer.setAttribute(element, 'class', newDropSeparatorBorderStyling);
          }
        }
      }
  }

  @HostListener('dragleave', ['$event']) public onDragLeave($event) {
    if (this.mode !== FormQLMode.View && $event) {
      const nativeElement = this.view.element.nativeElement;

      const currentDropAreaClasses = nativeElement.getAttribute('class') ? nativeElement.getAttribute('class') : '';
      if (currentDropAreaClasses.indexOf(this.dropAreaClass) !== -1)
        this.renderer.setAttribute(nativeElement, 'class', currentDropAreaClasses.replace(this.dropAreaClass, ''));

      const element = this.getPositionElement($event.srcElement);
      if (element) {
        const currentDropSeparatorBoderStyle = element.getAttribute('class') ? element.getAttribute('class') : '';
        if (currentDropSeparatorBoderStyle.indexOf(this.dropSeparatorBorderClass) !== -1)
          this.renderer.setAttribute(element, 'class', currentDropSeparatorBoderStyle.replace(this.dropSeparatorBorderClass, ''));
      }
    }
  }

  getPositionElement(sourceELement): HTMLElement {
    let className = 'fql-component-container-wrapper';

    if (this.type === ContainerType.Section) className = 'fql-section-wrapper-edit';

    let element = sourceELement;
    let i = 0;
    while (element.className && element.className.indexOf(className) === -1 && i < 10) {
      element = element.parentElement;
      i++;
    }

    if (element.className && element.className.indexOf(className) !== -1) return element as HTMLElement;

    return null;
  }

  getPositionAttribute(element): number {
    let attributeName = 'componentId';

    if (this.type === ContainerType.Section) attributeName = 'sectionId';

    return element.getAttribute(attributeName);
  }
}
