import { FormSection } from './form-section.model';
import { GridStyle } from './style.model';

export class FormPage {
    public pageId: string;
    public sections: FormSection[];
    public structure: string;
    public template: PageTemplate;
}

export class PageTemplate {
    public title: string;
    public body: GridStyle;
    public reRender: boolean;
}
