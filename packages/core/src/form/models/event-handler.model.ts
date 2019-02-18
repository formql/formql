export class EventHandler {
    public eventType: EventType;
    public event: any;
}

export enum EventType {
    // Editing events
    EditingComponent = 1,
    EditingSection = 2,
    
    // Form changes
    DndFormChanged = 4,
    
    
    // Save event
    SaveData = 5
}