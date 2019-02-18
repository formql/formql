import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditorJsonInputComponent } from './form-editor-json-input.component';

describe('FormEditorJsonInputComponent', () => {
  let component: FormEditorJsonInputComponent;
  let fixture: ComponentFixture<FormEditorJsonInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEditorJsonInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEditorJsonInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
