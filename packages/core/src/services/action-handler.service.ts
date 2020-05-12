import { Injectable, Output, EventEmitter } from '@angular/core';
import { FormAction } from '../models/action.model';


@Injectable({
  providedIn: 'root'
})
export class ActionHandlerService {
  @Output() action: EventEmitter<FormAction> = new EventEmitter();

  send(action: FormAction) {
    this.action.emit(action);
  }
}
