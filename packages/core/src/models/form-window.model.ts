import { FormPage } from './form-page.model';
import { FormComponent } from './form-component.model';

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
}

export interface FormState {
    data: any;
    form: FormWindow;
    components: FormComponent<any>[];
    isLoading: boolean;
    error: any;
}

export interface FormError {
    title: string;
    message: string;
    error: any;
}


