export interface OptionValue {
    name: string;
    value: any;
}

export interface SelectList {
    list: Array<OptionValue>;
    externalType: string;
}