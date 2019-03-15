export class InternalEventHandler {
    public eventType: InternalEventType;
    public event: any;
}

export enum InternalEventType {
    // Editing events
    EditingComponent = 1,
    EditingSection = 2,
    EditingPage = 3,
    EditingForm = 4,
    RemoveComponent = 5,
    RemoveSection = 6,
    RemovePage = 7,

    // Form changes
    DndFormChanged = 8,
    
    
    // Save event
    SubmitForm = 9
}