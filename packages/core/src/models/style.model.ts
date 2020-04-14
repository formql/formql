export interface GridStyle {
    hidden: boolean;
    style: any;
    gridTemplateColumns: string;
    gridTemplateRows: string;
    gridTemplateAreas: string;
}

export interface GridPosition {
    id: string;
    index: number;
    type: GridPositionType;
}

export enum GridPositionType {
    Header = 1,
    Body = 2,
    Footer = 3
}

export interface GridTemplate {
    title: string;
    header?: GridStyle;
    body: GridStyle;
    footer?: GridStyle;
    reRender: boolean;
}

