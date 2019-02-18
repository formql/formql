import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponentEditorMiscComponent } from './form-component-editor-misc.component';

describe('FormComponentEditorMiscComponent', () => {
  let component: FormComponentEditorMiscComponent;
  let fixture: ComponentFixture<FormComponentEditorMiscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponentEditorMiscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponentEditorMiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
