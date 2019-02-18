import { ComponentAction, FormActionTypes } from './form.actions';
import { formInitialState, FormState } from './form.state';

export function formStoreReducer(
    state = formInitialState, action: ComponentAction): FormState {

    switch (action.type) {
        case FormActionTypes.LOAD_SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                error: null,
                form: action.payload.form,
                components: action.payload.components,
                data: action.payload.data
            });

        case FormActionTypes.UPDATE_COMPONENT_SUCCESS:
            return Object.assign({}, state, {
                error: null,
                components: action.payload.components,
                data: action.payload.data 
            });

        case FormActionTypes.SAVE_FORM_SUCCESS:
            return Object.assign({}, state, {
                error: null,
                form: action.payload.form
            });

        case FormActionTypes.SAVE_DATA_SUCCESS:
            return Object.assign({}, state, {
                error: null,
                components: action.payload.components,
                data: action.payload.data 
            });

        case FormActionTypes.PROPERTY_CHANGED:
            return Object.assign({}, state, {
                error: null,
                components: action.payload.components
            });
        
        default:
            return state;
    }
};