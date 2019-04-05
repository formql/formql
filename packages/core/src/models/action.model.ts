export enum FormActionType {
    Validate = 'validate',
    ValidateAndSave = 'validateAndSave',
    Save = 'save',
    Custom = 'custom'
}

export declare interface FormActions {
    [key: string]: FormAction;
}

export interface FormAction {
    key: string;
    customkey: string;
    parameters: any;
}


