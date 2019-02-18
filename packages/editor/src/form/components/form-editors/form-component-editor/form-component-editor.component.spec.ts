import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponentEditorComponent } from './form-component-editor.component';

describe('FormComponentEditorComponent', () => {
  let component: FormComponentEditorComponent;
  let fixture: ComponentFixture<FormComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
