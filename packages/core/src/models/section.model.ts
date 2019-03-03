import { FormComponent, ComponentPosition, ComponentProperties } from "./form-component.model";
import { GridStyle } from "./grid-style.model";

export class Section {
    public sectionId: string;
    public sectionName: string;
    public components: FormComponent<any>[];
    public structure: string;
    public template: SectionTemplate;
    public position: SectionPosition;
    public headerStyle: string; 
    public sectionStyle: string; 

    properties: ComponentProperties;
}

export class SectionTemplate {
    public title: string;
    public header: GridStyle;
    public body: GridStyle;
    public reRender: boolean;
}

export interface SectionPosition {
    id: string;
    index: number;
  }



