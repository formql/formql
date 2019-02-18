import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditorFieldInputComponent } from './form-editor-field-input.component';

describe('FormEditorFieldInputComponent', () => {
  let component: FormEditorFieldInputComponent;
  let fixture: ComponentFixture<FormEditorFieldInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEditorFieldInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEditorFieldInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
