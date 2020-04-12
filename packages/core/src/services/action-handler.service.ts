import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { FormAction } from '../models/action.model';

@Directive()
@Injectable({
    providedIn: 'root'
})
export class ActionHandlerService {

    @Output() action: EventEmitter<FormAction> = new EventEmitter();

    send(action: FormAction) {
        this.action.emit(action);
    }
}
