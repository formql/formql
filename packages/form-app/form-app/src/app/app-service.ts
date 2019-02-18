import { Injectable } from "@angular/core";

import { IFormQLService } from "../../../../core/src/form/interfaces/formql-service";
import { FormWrapper } from "../../../../core/src/form/models/form-wrapper.model";
//import { IFormQLService, FormWrapper } from "@formql/core";
import { of } from 'rxjs';
import { HttpClient } from "@angular/common/http";


@Injectable()
export class DummyService implements IFormQLService {

    constructor(private http: HttpClient) {

    }
    getData(query: string, ids: string[]) {
        return of(new FormWrapper());
    }    
    getForm(name: string) {
        return this.http.get(`assets/api/${name}.json`);
    }
    getForms() {
        return of(new Array<FormWrapper>());
    }
    saveForm(name: string, form: FormWrapper) {
        return of({a:1});
    }
    saveData(mutation: string, ids: string[], data: any) {
        return of({a:1});
    }

}