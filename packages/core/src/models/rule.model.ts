import { ValidatorFn } from '@angular/forms';

export declare interface FormRules {
    [key: string]: FormRule;
}

export interface FormRule {
    key: string;
    condition: string;
    value: boolean;
    errorMessage: string;
}

export interface FormValidator {
    name: string;
    key: string;
    validator: ValidatorFn;
    parameters: any;
}
