import { Page } from "./page.model";
import { FormComponent } from "./form-component.model";

export class FormWrapper {
    public error: FormError;
    public pages: Page[];
    public layoutComponentName: string;
    public formName: string;
    public class: string;
    public dataSource: FormDataSource;
}

export class FormDataSource {
    public type: string;
    public query: string;
    public mutation: string;
}

export enum FormAction {
    Update = 0,
    Remove = 1,
    Create = 2
}

export interface FormState {
    data: any;
    form: FormWrapper;
    components: FormComponent<any>[];
    isLoading: boolean;
    error: any;
}

export interface FormError {
    title: string;
    message: string;
    error: any;
}