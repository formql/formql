import { ComponentPositionType } from './form-component.model';

export interface DndEvent {
    sourceObjectId: string;
    sourceWrapperId: string;
    targetPositionId: string;
    targetWrapperId: string;
    targetIndexId: string;
    positionType: ComponentPositionType;
}

export interface DndTransfer {
    sourceObjectId: string;
    sourceWrapperId: string;
    targetIndexId: string;
}
