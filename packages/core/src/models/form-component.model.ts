import { FormRules } from './rule.model';
import { FormAction } from './action.model';
import { FormControl } from '@angular/forms';
import { GridPosition } from './style.model';

export interface FormComponent<T> {
    componentId: string;
    componentName: string;
    value: T;
    textMask: any;
    schema: string;
    label: string;
    type: string;
    tabIndex: string;

    rules: FormRules;
    action: FormAction;

    position: GridPosition;

    style: any;
    configuration: any;

    dependents: FormComponent<any>[];
}

export interface ComponentControl {
    key: string;
    control: FormControl;
}

export interface ComponentGroup {
    [key: string]: Array<FormComponent<any>>;
}
