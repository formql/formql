import { FormComponent } from './form-component.model';
import { GridPosition, GridTemplate } from './style.model';
import { FormRules } from './rule.model';

export interface FormSection {
    sectionId: string;
    sectionName: string;
    components: FormComponent<any>[];
    template: GridTemplate;
    position: GridPosition;
    headerStyle: string;
    sectionStyle: string;

    rules: FormRules;
}






