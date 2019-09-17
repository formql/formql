import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionWrapperComponent } from './section-wrapper.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DndDirective } from '../directives/dnd.directive';
import { LayoutDirective } from '../directives/layout.directive';
import { SectionContainerComponent } from './section-container.component';
import { DndDropDirective } from '../directives/dnd-drop.directive';
import { ComponentContainerComponent } from './component-container.component';
import { FormSection } from '../models/form-section.model';
import { FormPage } from '../models/form-page.model';
import { GridTemplate, PageTemplate } from 'dist/formql/public_api';
import { FormRules } from '../models/rule.model';
import { FormQLMode } from '../models/type.model';

describe('SectionWrapperComponent', () => {
  let component: SectionWrapperComponent;
  let fixture: ComponentFixture<SectionWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        ReactiveFormsModule],
      declarations: [SectionWrapperComponent,
        DndDirective,
        LayoutDirective,
        SectionContainerComponent,
        DndDropDirective,
        ComponentContainerComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionWrapperComponent);
    component = fixture.componentInstance;
    component.section = <FormSection>JSON.parse(`
      {
        "components": [{
            "schema": "contact.lastName",
            "label": "Contact Info",
            "componentName": "FormQLLabelComponent",
            "type": "text",
            "order": 1,
            "position": {
                "id": "ID1_1",
                "index": 1,
                "type": 1
            },
            "componentId": "0af1e87f-19fe-e6e0-80ca-f1d512b889ec",
            "rules": {},
            "value": null,
            "style": {
                "padding": "0px",
                "margin": "10px",
                "border-bottom": "3px solid",
                "font-family": "Roboto,'Helvetica Neue',sans-serif"
            }
        }]
      }`);
    component.page = <FormPage>JSON.parse(`
    {
      "structure": "12",
      "template": {
          "title": "header",
          "body": {
              "gridTemplateColumns": "1fr 1fr",
              "gridTemplateRows": "",
              "gridTemplateAreas": "'ID1_1 ID1_2' 'ID2_1 ID2_2'"
          },
          "reRender": false
      },
      "sections": [{
          "components": [{
              "schema": "contact.lastName",
              "label": "Contact Info",
              "componentName": "FormQLLabelComponent",
              "type": "text",
              "order": 1,
              "position": {
                  "id": "ID1_1",
                  "index": 1,
                  "type": 1
              },
              "componentId": "0af1e87f-19fe-e6e0-80ca-f1d512b889ec",
              "rules": {},
              "value": null,
              "style": {
                  "padding": "0px",
                  "margin": "10px",
                  "border-bottom": "3px solid",
                  "font-family": "Roboto,'Helvetica Neue',sans-serif"
              }
          }],
          "position": {
            "id": "ID1_1",
            "index": 0
          },
          "sectionId": "1d3fcbe3-a029-ca5e-4791-9666155fff0f",
          "headerStyle": {
            "font-size": "1.2rem",
            "border-bottom": "2px solid #3F51B5",
            "margin-bottom": "10px",
            "color": "#3F51B5"
          },
          "template": {
            "title": "header",
            "header": {
              "hidden": false,
              "style": null,
              "gridTemplateColumns": "1fr",
              "gridTemplateAreas": "'ID1_1'"
            },
            "body": {
              "hidden": false,
              "gridTemplateColumns": "1fr 1fr",
              "style": null,
              "gridTemplateRows": "",
              "gridTemplateAreas": "'ID1_1 ID1_2' 'ID2_1 ID2_2' 'ID3_1 ID3_1' 'ID4_1 ID4_1'"
            },
            "reRender": false
          },
          "sectionName": "Contact Information"
        }]
    }`);
    component.reactiveSection = new FormGroup({});
    component.mode = FormQLMode.View;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
