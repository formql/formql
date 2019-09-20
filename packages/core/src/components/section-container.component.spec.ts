import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionContainerComponent } from './section-container.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormQLMode } from '../models/type.model';
import { CommonModule } from '@angular/common';
import { SectionWrapperComponent } from './section-wrapper.component';
import { DndDirective } from '../directives/dnd.directive';
import { LayoutDirective } from '../directives/layout.directive';
import { DndDropDirective } from '../directives/dnd-drop.directive';
import { ComponentContainerComponent } from './component-container.component';
import { TextMaskModule } from 'angular2-text-mask';
import { StoreService } from '../services/store.service';

describe('SectionContainerComponent', () => {
  let component: SectionContainerComponent;
  let fixture: ComponentFixture<SectionContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, TextMaskModule],
      declarations: [SectionWrapperComponent,
        DndDirective,
        LayoutDirective,
        SectionContainerComponent,
        DndDropDirective,
        ComponentContainerComponent,
        StoreService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionContainerComponent);
    component = fixture.componentInstance;
    component.section = {
          sectionStyle: null,
          rules: null,
          components: [{
              schema: 'contact.lastName',
              label: 'Contact Info',
              componentName: 'FormQLLabelComponent',
              type: 'text',
              position: {
                  id: 'ID1_1',
                  index: 1,
                  type: 1
              },
              componentId: '0af1e87f-19fe-e6e0-80ca-f1d512b889ec',
              rules: {},
              value: null,
              tabIndex: null,
              action: null,
              textMask: null,
              configuration: null,
              style: JSON.parse(`{
                  padding: '0px',
                  margin: '10px',
                  border-bottom': '3px solid',
                  font-family': 'Roboto,'Helvetica Neue',sans-serif'
              }`);
          }],
          position: {
            id: 'ID1_1',
            index: 0,
            type: null
          },
          sectionId: '1d3fcbe3-a029-ca5e-4791-9666155fff0f',
          headerStyle: JSON.parse(`{
            'font-size': '1.2rem',
            'border-bottom': '2px solid #3F51B5',
            'margin-bottom': '10px',
            'color': '#3F51B5'
          }`),
          template: {
            title: 'header',
            header: JSON.parse(`{
              'hidden': false,
              'style': null,
              'gridTemplateColumns': '1fr',
              'gridTemplateAreas': '"ID1_1"'
            }`),
            body: JSON.parse(`{
              'hidden': false,
              'gridTemplateColumns': '1fr 1fr',
              'style': null,
              'gridTemplateRows': '',
              'gridTemplateAreas': '"ID1_1 ID1_2" "ID2_1 ID2_2" "ID3_1 ID3_1" "ID4_1 ID4_1"'
            }`),
            footer: null,
            reRender: false
          },
          sectionName: 'Contact Information'
        };
    component.reactiveSection = new FormGroup({});
    component.mode = FormQLMode.View;
    fixture.detectChanges();
  });

  test('should create SectionContainerComponent', () => {
    expect(component).toBeTruthy();
  });
});
