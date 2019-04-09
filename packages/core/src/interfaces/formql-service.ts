import { FormWindow, FormDataSource } from '../models/form-window.model';
import { Observable } from 'rxjs';

export interface IFormQLService {
    getData(dataSource: FormDataSource, ids: Array<string>): Observable<any>;
    saveData(dataSource: FormDataSource, ids: Array<string>, data: any): Observable<any>;
    getForm(name: string): Observable<any>;
    getForms(): Observable<any>;
    saveForm(name: string, form: FormWindow): Observable<any>;
}

