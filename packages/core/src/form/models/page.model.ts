import { Section } from "./section.model";
import { GridStyle } from "./grid-style.model";

export class Page {
    public pageId: string;
    public sections: Section[];
    public structure: string;
    public template: PageTemplate;
}

export class PageTemplate {
    public title: string;
    public body: GridStyle;
    public reRender: boolean;
}
