import { FormWrapper } from "../models/form-wrapper.model";
import { Observable } from "rxjs/Observable";


export interface ServiceInterface {
    getData(query: string, ids: Array<string>): Observable<any>;
    getForm(name: string): Observable<any>;
    getForms(): Observable<any>;
    saveForm(name: string, form: FormWrapper): Observable<any>;
    saveData(mutation: string, ids: Array<string>, data: any): Observable<any>;

}

