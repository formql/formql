import { Page } from "./page.model";

export class FormWrapper {
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