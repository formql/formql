export interface ActionHandler {
    actionType: ActionType;
    action: any;
}

export enum ActionType {
    Validate = 1,
    Submit = 2,
    Save = 3,
    Custom = 4
}

export declare interface FormActions {
    [key: string]: FormAction;
}

export interface FormAction {
    key: ActionType;
    customkey: string;
    parameters: any;
}


