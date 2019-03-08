import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'
import { FormWrapper } from '../models/form-wrapper.model';
import { FormRxjxService } from './form-rxjs.service';
import { FormComponent } from '../models/form-component.model';

@Injectable({ providedIn: 'root' })
export class StoreService {
    constructor(private apiService: FormRxjxService) {

    }

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
        this.apiService.updateComponent(component).subscribe(res => {
            this._components.next(res.components);
            this._data.next(res.data);
        });
    }
    
    getAll(formName:string, ids: Array<string>) {
        this.apiService.getFormAndData(formName, ids).subscribe(res => {
            this._form.next(res.form);
            this._components.next(res.components);
            this._data.next(res.data);
        });
    }

    

    // async getForm(id: string) {
    //     this.form

    //     let todo = this.todos.find(todo => todo.id === id);
    // }

    // async getComponents(id: string) {
    //     let todo = this.todos.find(todo => todo.id === id);
    // }

    // async getData(id: string) {
    //     let todo = this.todos.find(todo => todo.id === id);
    // }

    // readonly getForm$ = this.todos$.pipe(
    //     map(todos => this.todos.filter(todo => todo.isCompleted))
    //   )


}