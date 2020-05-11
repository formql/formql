import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PageWrapperComponent } from './page-wrapper.component';
import { SectionWrapperComponent } from './section-wrapper.component';
import { DndDirective } from '../directives/dnd.directive';
import { LayoutDirective } from '../directives/layout.directive';
import { DndDropDirective } from '../directives/dnd-drop.directive';
import { ComponentContainerComponent } from './component-container.component';
import { FormQLLabelComponent } from '../bundle/formql-label.component';
import { DndService } from '../services/dnd.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { LayoutLoaderComponent } from './layout-loader.component';
import { FormState } from '../models/form-window.model';

describe('LayoutLoaderComponent', () => {
  let component: LayoutLoaderComponent;
  let fixture: ComponentFixture<LayoutLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        ReactiveFormsModule],
      declarations: [ LayoutLoaderComponent,
        PageWrapperComponent,
        SectionWrapperComponent,
        DndDirective,
        LayoutDirective,
        DndDropDirective,
        ComponentContainerComponent,
        FormQLLabelComponent
      ],
      providers: [DndService, { provide: 'FormQLService' }]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [FormQLLabelComponent]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutLoaderComponent);
    component = fixture.componentInstance;
    component.formState = <FormState>{};
    component.formState.form = {
      error: null,
      class: null,
      dataSource: null,
      layoutComponentName: 'PlainLayoutComponent',
      formName: 'contactInfo',
      pages: [{
      structure: '12',
      pageId: '1d3fcbe3-a029-aaaa-4791-9666155fff0f',
      template: {
        title: 'header',
        body: {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '',
          gridTemplateAreas: '"ID1_1 ID1_2" "ID2_1 ID2_2"',
          hidden: null,
          style: null
        },
        reRender: false
      },
      sections: [{
        sectionStyle: null,
        rules: null,
        components: [{
          textMask: null,
          tabIndex: null,
          action: null,
          configuration: null,
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
          style: JSON.parse(JSON.stringify({
                  'padding': '0px',
                  'margin': '10px',
                  'border-bottom': '3px solid',
                  'font-family': 'Roboto,Helvetica Neue,sans-serif'
              }))
        }],
        position: {
          id: 'ID1_1',
          index: 0,
          type: null
        },
        sectionId: '1d3fcbe3-a029-ca5e-4791-9666155fff0f',
        headerStyle: JSON.parse(JSON.stringify({
            'font-size': '1.2rem',
            'border-bottom': '2px solid #3F51B5',
            'margin-bottom': '10px',
            'color': '#3F51B5'
          })),
        template: {
          title: 'header',
          header: JSON.parse(JSON.stringify({
              'hidden': false,
              'style': null,
              'gridTemplateColumns': '1fr',
              'gridTemplateAreas': '"ID1_1"'
            })),
          body: JSON.parse(JSON.stringify({
              'hidden': false,
              'gridTemplateColumns': '1fr 1fr',
              'style': null,
              'gridTemplateRows': '',
              'gridTemplateAreas': '"ID1_1 ID1_2" "ID2_1 ID2_2" "ID3_1 ID3_1" "ID4_1 ID4_1"'
            })),
          reRender: false
        },
        sectionName: 'Contact Information'
      }]
      }]
    };
    // component.reactiveForm = new FormGroup({
    //   '1d3fcbe3-a029-aaaa-4791-9666155fff0f': new FormGroup({
    //     '1d3fcbe3-a029-ca5e-4791-9666155fff0f': new FormGroup({
    //       '0af1e87f-19fe-e6e0-80ca-f1d512b889ec': new FormControl('')
    //     })
    //   })
    // });
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
