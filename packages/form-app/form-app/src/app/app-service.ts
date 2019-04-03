import { Injectable } from "@angular/core";

import { IFormQLService, FormWindow, FormDataSource } from "@formql/core";
import { of } from 'rxjs';
import { HttpClient } from "@angular/common/http";


@Injectable()
export class DummyService implements IFormQLService {

    constructor(private http: HttpClient) {

    }
    getData(dataSource: FormDataSource, ids: string[]) {
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
    saveData(dataSource: FormDataSource, ids: string[], data: any) {
        let item = ids + '_saved';
        localStorage.setItem(item, JSON.stringify(data));
        return of(true);
    }

}