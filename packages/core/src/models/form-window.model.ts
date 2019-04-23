import { FormPage } from './form-page.model';
import { FormComponent } from './form-component.model';
import { FormGroup } from '@angular/forms';

export interface FormWindow {
    error: FormError;
    pages: FormPage[];
    layoutComponentName: string;
    formName: string;
    class: string;
    dataSource: FormDataSource;
}

export interface FormDataSource {
    type: string;
    query: string;
    mutation: string;
    deltaMode: boolean;
}

export interface FormState {
    data: any;
    form: FormWindow;
    reactiveForm: FormGroup;
    components: FormComponent<any>[];
    ids: Array<string>;
    isLoading: boolean;
    error: any;
}

export interface FormError {
    title: string;
    message: string;
    error: any;
}


