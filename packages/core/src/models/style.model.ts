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
}

export interface GridTemplate {
    title: string;
    header: GridStyle;
    body: GridStyle;
    footer: GridStyle;
    reRender: boolean;
}

