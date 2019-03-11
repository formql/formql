import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'
import { FormWrapper, FormError } from '../models/form-wrapper.model';
import { FormService } from './form.service';
import { FormComponent } from '../models/form-component.model';
import { HelperService } from './helper.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
    constructor(
        private formService: FormService
    ) {}

    private readonly _form = new Subject<FormWrapper>();

    private readonly _components = new Subject<FormComponent<any>[]>();

    private readonly _data = new Subject<any>();

    getForm(): Observable<FormWrapper> {
        return this._form.asObservable();
    }

    getData(): Observable<any> {
        return this._data.asObservable();
    }

    getComponents(): Observable<FormComponent<any>[]> {
        return this._components.asObservable();
    }

    setComponet(component: FormComponent<any>) {
        this.formService.updateComponent(component).subscribe(res => {
            this._components.next(res.components);
            this._data.next(res.data);
        });
    }
    
    getAll(formName:string, ids: Array<string>) {
        this.formService.getFormAndData(formName, ids).subscribe(res => {
            this._form.next(res.form);
            this._components.next(res.components);
            this._data.next(res.data);
        },
        error => {
            this._form.next(<FormWrapper>{
                error: HelperService.formatError(<FormError>{
                    title: "Error loading form or data",
                    error: error
                })
            })
        });
    }
}