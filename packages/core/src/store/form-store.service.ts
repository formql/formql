import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as Action from './form.actions';
import * as State from './form.state';
import { FormGroup } from '@angular/forms';
import { FormWrapper } from '../models/form-wrapper.model';
import { FormComponent } from '../models/form-component.model';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FormStoreService {
    
    action = new Subject();

    constructor(private store: Store<AppState>) { }

    private dispatchAction(action: Action.ComponentAction) {
        this.store.dispatch(action);
    }

    dispatchLoadAction(formName: string, ids: Array<string>) {
        this.dispatchAction(new Action.LoadAction(formName, ids, { components: [] }));
    }
    
    dispatchUpdateComponentAction(component: FormComponent<any>) {
        this.dispatchAction(new Action.UpdateComponentAction({ component: component }));
    }

    dispatchUpdateFormAction(form: FormWrapper) {
        this.dispatchAction(new Action.UpdateFormAction({ form: form }));
    }

    dispatchSaveFormAction(formName: string, form: FormWrapper) {
        this.dispatchAction(new Action.SaveFormAction({ formName: formName, form: form }));
    }
    
    dispatchSaveDataAction(mutation: string, ids: Array<string>, data: any) {
        this.dispatchAction(new Action.SaveDataAction({ mutation: mutation, ids: ids, data: data}));
    }

    
    getComponents() {
        return this.store.select(State.getComponents);
    }

    getForm() {
        return this.store.select(State.getForm);
    }

    getData() {
        return this.store.select(State.getData);
    }
    
}