import { ValidatorFn, FormControl } from "@angular/forms";

export interface FormComponent<T>  {
    componentId: string; 
    componentName: string;
    value: T;
    textMask: any;
    schema: string;
    label: string;
    type: string; 
    tabIndex: string;
    
    properties: ComponentProperties;

    position: ComponentPosition;

    style: any;
    configuration: any;
  }

  
export interface ComponentPosition {
  id: string;
  index: number;
  type: ComponentPositionType;
}

export enum ComponentPositionType {
    Header = 1,
    Body = 2
}

export declare type ComponentProperties = {
  [key: string]: ComponentProperty;
}

export interface ComponentProperty {
  key: string;
  condition: string;
  value: boolean;
  errorMessage: string;
}

export interface ComponentValidator {
  name: string;
  key: string;
  validator: ValidatorFn;
  parameters: any;
}

export interface ComponentControl {
  key: string;
  control: FormControl;
}