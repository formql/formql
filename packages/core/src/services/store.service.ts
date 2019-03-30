import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormWindow, FormError, FormState } from '../models/form-window.model';
import { FormService } from './form.service';
import { FormComponent } from '../models/form-component.model';
import { HelperService } from './helper.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
    constructor(
        private formService: FormService
    ) {}

    private readonly _form = new Subject<FormWindow>();

    private readonly _components = new Subject<FormComponent<any>[]>();

    private readonly _data = new Subject<any>();

    private formState: FormState;

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
        this.formService.updateComponent(component, this.formState).subscribe(response => {
            this._components.next(response.components);
            this._data.next(response.data);
        });
    }

    getAll(formName: string, ids: Array<string>) {
        this.formService.getFormAndData(formName, ids).subscribe(response => {
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
            })
        });
    }

    saveForm(name: string, form: FormWindow) {
        this.formService.saveForm(name, form);
    }

    saveData() {

    }
}