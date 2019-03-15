export class ActionHandler {
    public actionType: ActionType;
    public action: any;
}

export enum ActionType {
    // Save event
    SaveForm = 1,
    SubmitForm = 2
}