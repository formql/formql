import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import {
    map,
    switchMap,
    mergeMap,
    catchError,
    concatMap,
    tap
} from 'rxjs/operators';

import { FormService } from '../services/form.service';
import * as Action from './form.actions';
import { FormWrapper } from '../models/form-wrapper.model';
import { FormComponent } from '../models/form-component.model';

@Injectable()
export class FormEffects {
    constructor(private api: FormService, private actions$: Actions) { }


    @Effect()
    loadAction$ = this.actions$.pipe(
        ofType<Action.LoadAction>(Action.FormActionTypes.LOAD),
        switchMap((payload) =>
            this.api.getFormAndData(payload.fornName, payload.ids).pipe(
                map(res => {
                    return new Action.LoadActionSuccess({ form: res.form, components: res.components, data: res.data }
                    )
                }),
                catchError(error => this.handleError(error)))
        ));

    @Effect()
    updateComponentAction$ = this.actions$.pipe(
        ofType<Action.UpdateComponentAction>(Action.FormActionTypes.UPDATE_COMPONENT),
        map(action => action.payload),
        switchMap(payload => this.api.updateComponent(payload.component)),
        switchMap(res => [
            new Action.UpdateComponentActionSuccess({ component: res.component, data: res.data }),
            new Action.PropertyChangedAction({ components: res.components })
        ]),
        catchError(error => this.handleError(error)));

    @Effect()
    updateFormAction$ = this.actions$.pipe(
        ofType<Action.UpdateFormAction>(Action.FormActionTypes.UPDATE_FORM),
        map(action => action.payload),
        switchMap(payload => this.api.updateForm(payload.form)),
        switchMap(res => [
            new Action.UpdateFormActionSuccess({ form: res.form })
        ]),
        catchError(error => this.handleError(error)));

    @Effect()
    saveFormAction$ = this.actions$.pipe(
        ofType<Action.SaveFormAction>(Action.FormActionTypes.SAVE_FORM),
        map(action => action.payload),
        switchMap(payload => this.api.saveForm(payload.formName, payload.form)),
        switchMap( res => [
            new Action.SaveFormActionSuccess({ form: res})
        ]),
        catchError(error => this.handleError(error)));


    @Effect()
    saveDataAction$ = this.actions$.pipe(
        ofType<Action.SaveDataAction>(Action.FormActionTypes.SAVE_DATA),
        map(action => action.payload),
        switchMap(payload => this.api.saveData(payload.mutation, payload.ids, payload.data)),
        switchMap(res => [
            new Action.SaveDataActionSuccess({ data: res })
        ]),
        catchError(error => this.handleError(error)));

    private handleError(error) {
        console.log(error);
        return of(new Action.ErrorAction(error));
    }
}
