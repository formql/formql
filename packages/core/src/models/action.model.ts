export interface ActionHandler {
    actionType: ActionType;
    action: any;
}

export enum ActionType {
    SaveForm = 1,
    SubmitForm = 2
}


