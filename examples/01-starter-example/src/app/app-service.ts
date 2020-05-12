import { Injectable } from "@angular/core";
import { IFormQLService, FormWindow, FormDataSource } from "@formql/core";
import { of, throwError, Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";


@Injectable()
export class DummyService implements IFormQLService {

    constructor(private http: HttpClient) {

    }
    getData(dataSource: FormDataSource, ids: Array<string>) {
        if (!ids)
            throwError('no ids provided!');

        let item = localStorage.getItem(ids[0]);
        if (item)
            return of(JSON.parse(item));
        
        return of({});
    }    

    getForm(name: string) {
        let item = localStorage.getItem(name);
        if (item)
            return of(JSON.parse(item));
        else
            return this.http.get(`assets/api/${name}.json`);
    }
    getForms() {
        return of(new Array<FormWindow>());
    }
    saveForm(name: string, form: FormWindow) {
        localStorage.setItem(name, JSON.stringify(form));
        return of(form);
    }
    saveData<T>(dataSource: FormDataSource, ids: Array<string>, data: T): Observable<T> {
        if (!ids)
            throwError('no ids provided!');

        localStorage.setItem(ids[0], JSON.stringify(data));
        return of(data);
    }

}