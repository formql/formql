import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { FormWindow, FormError, FormState } from '../models/form-window.model';
import { FormService } from './form.service';
import { FormComponent } from '../models/form-component.model';
import { HelperService } from './helper.service';
import { takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StoreService {
    constructor(
        private formService: FormService
    ) {}

    private _form: Subject<FormWindow>;

    private _components: Subject<Array<FormComponent<any>>>;

    private _data: Subject<any>;

    private readonly serviceDestroyed = new Subject();

    private formState: FormState;

    initialiseStore() {
        this._form = new Subject<FormWindow>();
        this._components = new Subject<Array<FormComponent<any>>>();
        this._data = new Subject<any>();
    }

    destroyStore() {
        this._form.complete();
        this._form.unsubscribe();
        this._components.complete();
        this._components.unsubscribe();
        this._data.complete();
        this._data.unsubscribe();
    }

    getForm(): Observable<FormWindow> {
        return this._form.asObservable();
    }

    getComponents(): Observable<FormComponent<any>[]> {
        return this._components.asObservable();
    }

    getData(): Observable<FormComponent<any>[]> {
        return this._data.asObservable();
    }

    setComponet(component: FormComponent<any>) {
        this.formService.updateComponent(component, this.formState).pipe(takeUntil(this.serviceDestroyed)).subscribe(response => {
            this._components.next(response.components);
            this._data.next(response.data);
        });
    }

    getAll(formName: string, ids: Array<string>) {
        this.formService.getFormAndData(formName, ids).pipe(takeUntil(this.serviceDestroyed)).subscribe(response => {
            this.formState = {...response};
            this._form.next(response.form);
            this._components.next(response.components);
            this._data.next(response.data);
        },
        error => {
            this._form.next(<FormWindow>{
                error: HelperService.formatError(<FormError>{
                    title: 'Error loading form or data',
                    error: error
                })
            });
        });
    }

    saveForm(name: string, form: FormWindow) {
        this.formService.saveForm(name, form);
    }

    saveData(ids: Array<string>) {
        return this.formService.saveData(this.formState.form.dataSource, ids, this.formState.data);
    }

    unsubscribeAll() {
        this.serviceDestroyed.next();
        this.serviceDestroyed.complete();
    }
}
