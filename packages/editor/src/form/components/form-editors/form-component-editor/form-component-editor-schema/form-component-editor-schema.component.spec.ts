import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponentEditorSchemaComponent } from './form-component-editor-schema.component';

describe('FormComponentEditorSchemaComponent', () => {
  let component: FormComponentEditorSchemaComponent;
  let fixture: ComponentFixture<FormComponentEditorSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponentEditorSchemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponentEditorSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
