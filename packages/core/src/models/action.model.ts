export enum FormActionType {
    Validate = 'validate',
    ValidateAndSave = 'validateAndSave',
    Save = 'save',
    Custom = 'custom'
}

export interface FormAction {
    key: FormActionType;
    customkey: string;
    parameters: any;
}


