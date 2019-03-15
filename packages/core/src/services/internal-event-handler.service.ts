import { Injectable, Output, EventEmitter } from "@angular/core";
import { InternalEventHandler, InternalEventType } from "../models/internal-event-handler.model";

@Injectable({
    providedIn: 'root'
})
export class InternalEventHandlerService {

  @Output() event: EventEmitter<any> = new EventEmitter();

  send(eventType: InternalEventType, event: any) {
    let eventHandler = new InternalEventHandler();
    eventHandler.event = event;
    eventHandler.eventType = eventType;
    this.event.emit(eventHandler);
  }

}