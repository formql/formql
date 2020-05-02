import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLButtonComponent } from './formql-button.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

describe('FormQLButtonComponent', () => {
  let component: FormQLButtonComponent;
  let fixture: ComponentFixture<FormQLButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [ FormQLButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLButtonComponent);
    component = fixture.componentInstance;
    component.field = {
      schema: 'contact.lastName',
      label: 'Last Name',
      componentName: 'FormQLButtonComponent',
      type: 'text',
      dependents: null,
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
    component.formControl = new FormControl('');
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
