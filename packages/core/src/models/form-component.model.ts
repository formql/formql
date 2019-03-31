import { FormRules } from './rule.model';
import { FormActions } from './action.model';
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
    actions: FormActions;

    position: GridPosition;

    style: any;
    configuration: any;
}

export interface ComponentControl {
    key: string;
    control: FormControl;
}
