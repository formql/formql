import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FormComponent } from "../models/form-component.model";
import { FormWrapper } from "../models/form-wrapper.model";
import { MemoizedSelector } from "@ngrx/store";

export interface FormState {
    data: any;
    form: FormWrapper;
    components: FormComponent<any>[];
    isLoading: boolean;
    error: any;
}

export const formInitialState: FormState = {
    data: null,
    form: null,
    components: [],
    isLoading: true,
    error: null
  };

export interface PropertyChange {
    components: FormComponent<any>[];
}


// Selectors 
export const componentState = createFeatureSelector<FormState>('formStore');
export const getForm = createSelector(componentState, (state: FormState) => state.form);
export const getComponents = createSelector(componentState, (state: FormState) => state.components);
export const getData = createSelector(componentState, (state: FormState) => state.data);



