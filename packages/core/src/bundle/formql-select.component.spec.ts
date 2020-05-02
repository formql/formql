import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLSelectComponent } from './formql-select.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

describe('FormQLSelectComponent', () => {
  let component: FormQLSelectComponent;
  let fixture: ComponentFixture<FormQLSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [ FormQLSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLSelectComponent);
    component = fixture.componentInstance;
    component.field = {
      schema: 'contact.lastName',
      label: 'Contact Info',
      componentName: 'FormQLSelectComponent',
      type: 'radio',
      position: {
        id: 'ID1_1',
        index: 1,
        type: 1
      },
      componentId: '0af1e87f-19fe-e6e0-80ca-f1d512b889ec',
      dependents: null,
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
