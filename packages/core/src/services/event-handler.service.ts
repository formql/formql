import { Injectable, Output, EventEmitter } from "@angular/core";
import { EventHandler, EventType } from "../models/event-handler.model";

@Injectable({
    providedIn: 'root'
})
export class EventHandlerService {

  @Output() event: EventEmitter<any> = new EventEmitter();

  send(eventType: EventType, event: any) {
    let eventHandler = new EventHandler();
    eventHandler.event = event;
    eventHandler.eventType = eventType;
    this.event.emit(eventHandler);
  }

}