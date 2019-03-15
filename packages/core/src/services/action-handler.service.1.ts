import { Injectable, Output, EventEmitter } from "@angular/core";
import { ActionType, ActionHandler } from "../models/action-handler.model";

@Injectable({
    providedIn: 'root'
})
export class ActionHandlerService {

  @Output() action: EventEmitter<any> = new EventEmitter();

  send(actionType: ActionType, action: any) {
    let actionHandler = new ActionHandler();
    actionHandler.action = action;
    actionHandler.action = actionType;
    this.action.emit(actionHandler);
  }

}