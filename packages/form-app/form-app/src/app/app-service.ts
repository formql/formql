import { Injectable } from "@angular/core";

import { IFormQLService, FormWrapper } from "@formql/core";
import { of } from 'rxjs';
import { HttpClient } from "@angular/common/http";


@Injectable()
export class DummyService implements IFormQLService {

    constructor(private http: HttpClient) {

    }
    getData(query: string, ids: string[]) {
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
        return of(new Array<FormWrapper>());
    }
    saveForm(name: string, form: FormWrapper) {
        localStorage.setItem(name, JSON.stringify(form));
        return of(form);
    }
    saveData(mutation: string, ids: string[], data: any) {
        return of({a:1});
    }

}