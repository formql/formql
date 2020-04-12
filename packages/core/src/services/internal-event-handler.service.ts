import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { InternalEventHandler, InternalEventType } from '../models/internal-event.model';

@Directive()
@Injectable({
    providedIn: 'root'
})
export class InternalEventHandlerService {

  @Output() event: EventEmitter<any> = new EventEmitter();

  send(eventType: InternalEventType, event: any) {
    const eventHandler = <InternalEventHandler> {
        event: event,
        eventType: eventType
    };
    this.event.emit(eventHandler);
  }

}