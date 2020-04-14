import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentContainerComponent } from './component-container.component';
import { DndDirective } from '../directives/dnd.directive';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { FormQLLabelComponent } from '../bundle/formql-label.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('ComponentContainerComponent', () => {
  let component: ComponentContainerComponent;
  let fixture: ComponentFixture<ComponentContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        ReactiveFormsModule],
      declarations: [ComponentContainerComponent,
        DndDirective,
        FormQLLabelComponent
      ],
      providers: [{ provide: 'FormQLService' }]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [FormQLLabelComponent]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentContainerComponent);
    component = fixture.componentInstance;
    component.component = {
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
              }`)
    };
    component.sectionId = '1d3fcbe3-a029-ca5e-4791-9666155fff0f';
    component.reactiveSection = new FormGroup({
      '0af1e87f-19fe-e6e0-80ca-f1d512b889ec':  new FormControl('')
    });
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
