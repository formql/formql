import { FormSection } from './form-section.model';
import { GridStyle } from './style.model';

export interface FormPage {
    pageId: string;
    sections: FormSection[];
    structure: string;
    template: PageTemplate;
}

export interface PageTemplate {
    title: string;
    body: GridStyle;
    reRender: boolean;
}
