import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditorComponent } from './form-editor.component';

describe('FormEditorComponent', () => {
  let component: FormEditorComponent;
  let fixture: ComponentFixture<FormEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
