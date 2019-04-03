import { Injectable, Output, EventEmitter } from '@angular/core';
import { FormActions, FormAction } from '../models/action.model';

@Injectable({
    providedIn: 'root'
})
export class ActionHandlerService {

    @Output() action: EventEmitter<FormAction> = new EventEmitter();

    send(formActions: FormActions) {
        if (formActions) {
            const arr = Object.keys(formActions);
            if (arr && arr[0]) {
                const action = <FormAction>formActions[arr[0]];
                this.action.emit(action);
            }
        }
    }
}
