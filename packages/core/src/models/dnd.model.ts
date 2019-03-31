import { GridPositionType } from './style.model';

export interface DndEvent {
    sourceObjectId: string;
    sourceWrapperId: string;
    targetPositionId: string;
    targetWrapperId: string;
    targetIndexId: string;
    positionType: GridPositionType;
}

export interface DndTransfer {
    sourceObjectId: string;
    sourceWrapperId: string;
    targetIndexId: string;
}
