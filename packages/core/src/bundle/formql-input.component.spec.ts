import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLInputComponent } from './formql-input.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

describe('FormQLInputComponent', () => {
  let component: FormQLInputComponent;
  let fixture: ComponentFixture<FormQLInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, TextMaskModule],
      declarations: [ FormQLInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLInputComponent);
    component = fixture.componentInstance;
    component.field = {
      schema: 'contact.lastName',
      label: 'Last Name',
      componentName: 'FormQLInputComponent',
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
    component.formControl = new FormControl('');
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
