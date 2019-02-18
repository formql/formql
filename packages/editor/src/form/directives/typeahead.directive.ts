import { Directive, HostListener, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { TypeheadEvent } from '../components/form-typeahead/form-typeahead.component';

@Directive({
  selector: '[typeahead]'
})
export class TypeAheadDirective {
  @Input() set typeahead(s) {
    this.el.nativeElement.innerText = s;
    if (typeof window.getSelection != "undefined"
      && typeof document.createRange != "undefined") {
      let range = document.createRange();
      range.selectNodeContents(this.el.nativeElement);
      range.collapse(false);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
  
  @Output() keyup = new EventEmitter<TypeheadEvent>();

  @HostListener('click') click() {
    this.r.setAttribute(this.el.nativeElement, 'contentEditable', "true");
    this.el.nativeElement.focus();
  }

  @HostListener('keydown', ['$event']) onKeyDown($event){
    if ($event != null && ($event.code == "ArrowDown" || $event.code == "ArrowUp" || $event.code == "Enter"))
    {
        let event = new TypeheadEvent();
        event.menuEvent = true;
        event.value = $event.code;
        event.keyEvent = $event;
        this.keyup.emit(event);
    }
  }

  @HostListener('keyup', ['$event']) onKeyUp($event){
    if ($event != null && ($event.code == "ArrowDown" || $event.code == "ArrowUp" || $event.code == "Enter"))
      return;
    
    if ($event != null && !$event.menuEvent && this.el.nativeElement.innerText !== $event.value)
    {
        let event = new TypeheadEvent();
        event.menuEvent = false;
        event.value = this.el.nativeElement.innerText;
        event.coordinates = this.getCaretCharacterOffsetWithin($event.srcElement);
        this.keyup.emit(event);
    }
  }

  getCaretCharacterOffsetWithin(element) {
    // https://stackoverflow.com/questions/6846230/coordinates-of-selected-text-in-browser-page
    // https://stackoverflow.com/questions/3972014/get-caret-position-in-contenteditable-div
      let x = 0;
      let y = 0;
      let doc = element.ownerDocument || element.document;
      let win = doc.defaultView || doc.parentWindow;
      let sel;
      if (typeof win.getSelection != "undefined") {
          sel = win.getSelection();
          if (sel.rangeCount > 0) {
              let range = win.getSelection().getRangeAt(0);
              
              if (range.getClientRects) {
                  range.collapse(true);
                  let rects = range.getClientRects();
                  let rect;
                  if (rects.length > 0) {
                      rect = rects[0];
                  }
                  if (rect)
                  {
                      x = rect.left;
                      y = rect.y;
                  }
              }
          }
      } 
      return { x: x, y: y };
  }

  constructor(private el: ElementRef, private r: Renderer2) {
    this.r.setStyle(this.el.nativeElement, 'display', 'inline-block')
  }

}