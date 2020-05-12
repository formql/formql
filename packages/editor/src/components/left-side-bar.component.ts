import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output, OnDestroy } from '@angular/core';
import { InternalEventHandlerService, InternalEventType, ContainerType, FormQLMode } from '@formql/core';

@Component({
  selector: 'formql-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent {
  @Input() mode: FormQLMode;

  @Output() leftSideNavBarAction = new EventEmitter();

  public ContainerType = ContainerType;

  constructor(private eventHandlerService: InternalEventHandlerService) {}

  editPage() {
    this.eventHandlerService.send(InternalEventType.EditingPage, {});
  }

  rightSideNavBarActionClick($event) {
    this.leftSideNavBarAction.emit($event);
  }

  saveForm() {
    this.leftSideNavBarAction.emit('saveForm');
  }
}
