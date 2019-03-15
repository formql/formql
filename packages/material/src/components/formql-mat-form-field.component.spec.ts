import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLMatFormFieldComponent } from './formql-mat-form-field.component';

describe('FormQLMatFormFieldComponent', () => {
  let component: FormQLMatFormFieldComponent;
  let fixture: ComponentFixture<FormQLMatFormFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQLMatFormFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLMatFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
