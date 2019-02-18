import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSectionEditorComponent } from './form-section-editor.component';

describe('FormSectionEditorComponent', () => {
  let component: FormSectionEditorComponent;
  let fixture: ComponentFixture<FormSectionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSectionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSectionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
