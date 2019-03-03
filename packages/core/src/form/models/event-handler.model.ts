export class EventHandler {
    public eventType: EventType;
    public event: any;
}

export enum EventType {
    // Editing events
    EditingComponent = 1,
    EditingSection = 2,
    EditingPage = 3,
    EditingForm = 4,
    
    // Form changes
    DndFormChanged = 5,
    
    
    // Save event
    SubmitForm = 6
}