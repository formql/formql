import { FormComponent, ComponentProperties } from './form-component.model';
import { GridPosition, GridTemplate } from './style.model';

export interface FormSection {
    sectionId: string;
    sectionName: string;
    components: FormComponent<any>[];
    template: GridTemplate;
    position: GridPosition;
    headerStyle: string;
    sectionStyle: string;

    properties: ComponentProperties;
}






