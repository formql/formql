import { Action } from '@ngrx/store';

import { FormGroup } from '@angular/forms';
import { FormWrapper } from '../models/form-wrapper.model';
import { FormComponent } from '../models/form-component.model';

export enum FormActionTypes {
  LOAD = '[Form] LOAD Requested',
  LOAD_SUCCESS = '[Form] LOAD Succeeded',
  UPDATE_COMPONENT = '[Form] UPDATE COMPONENT Requested',
  UPDATE_COMPONENT_SUCCESS = '[Form] UPDATE COMPONENT Succeeded',
  UPDATE_FORM = '[Form] UPDATE FORM Requested',
  UPDATE_FORM_SUCCESS = '[Form] UPDATE FORM Succeeded',
  SAVE_FORM = '[Form] SAVE FORM Requested',
  SAVE_FORM_SUCCESS = '[Form] SAVE FORM Succeeded',
  SAVE_DATA = '[Form] SAVE DATA Requested',
  SAVE_DATA_SUCCESS = '[Form] SAVE DATA Succeeded',
  PROPERTY_CHANGED = '[Form] Property Changed',
  ERROR = '[Form] Error'
}

export class LoadAction implements Action {
  type = FormActionTypes.LOAD;
  constructor(public fornName:string, public ids: Array<string>, public payload?: any) { }
}

export class LoadActionSuccess implements Action {
  type = FormActionTypes.LOAD_SUCCESS;
  constructor(public payload: { form: FormWrapper, components: FormComponent<any>[], data: any} ) { }
}

export class UpdateComponentAction implements Action {
  type = FormActionTypes.UPDATE_COMPONENT;
  constructor(public payload: { component: FormComponent<any>}) { }
}

export class UpdateComponentActionSuccess implements Action {
  type = FormActionTypes.UPDATE_COMPONENT_SUCCESS;
  constructor(public payload: { component: FormComponent<any>, data: any }) {  }
}

export class UpdateFormAction implements Action {
  type = FormActionTypes.UPDATE_FORM;
  constructor(public payload: { form: FormWrapper }) { }
}

export class UpdateFormActionSuccess implements Action {
  type = FormActionTypes.UPDATE_FORM_SUCCESS;
  constructor(public payload: { form: FormWrapper }) {  }
}

export class SaveFormAction implements Action {
  type = FormActionTypes.SAVE_FORM;
  constructor(public payload: { formName: string, form: FormWrapper }) { }
}

export class SaveFormActionSuccess implements Action {
  type = FormActionTypes.SAVE_FORM_SUCCESS;
  constructor(public payload: { form: FormWrapper }) {  }
}

export class SaveDataAction implements Action {
  type = FormActionTypes.SAVE_DATA;
  constructor(public payload: { mutation: string, ids: Array<string>, data: any}) { }
}

export class SaveDataActionSuccess implements Action {
  type = FormActionTypes.SAVE_DATA_SUCCESS;
  constructor(public payload: { data: any }) {  }
}

export class PropertyChangedAction implements Action {
  type = FormActionTypes.PROPERTY_CHANGED;
  constructor(public payload: { components: FormComponent<any>[] }) { }
}

export class ErrorAction implements Action {
  type = FormActionTypes.ERROR;
  constructor(public payload: any) { }
}

export type ComponentAction =
  LoadAction | LoadActionSuccess |
  UpdateComponentAction | UpdateComponentActionSuccess |
  UpdateFormAction | UpdateFormActionSuccess |
  SaveFormAction | SaveFormActionSuccess |
  SaveDataAction | SaveDataActionSuccess |
  PropertyChangedAction | ErrorAction;