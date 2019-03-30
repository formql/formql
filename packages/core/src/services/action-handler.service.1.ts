import { Injectable, Output, EventEmitter } from '@angular/core';
import { ActionType, ActionHandler } from '../models/action.model';

@Injectable({
    providedIn: 'root'
})
export class ActionHandlerService {

  @Output() action: EventEmitter<any> = new EventEmitter();

  send(actionType: ActionType, action: any) {
    const actionHandler = <ActionHandler> {
        action: action,
        actionType: actionType
    }
    this.action.emit(actionHandler);
  }

}