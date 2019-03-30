export interface OptionValue {
    name: string;
    value: any;
}

export interface SelectList {
    list: Array<OptionValue>;
    externalType: string;
}

export enum ContainerType {
    Section = 1,
    Component = 2,
    Page = 3
}

export enum FormQLMode {
    View = 0,
    Edit = 1
}

export interface EvalResponse {
    value: boolean | any;
    error: any;
}
