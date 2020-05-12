import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditorComponent } from './form-editor.component';

describe('FormEditorComponent', () => {
  let component: FormEditorComponent<any>;
  let fixture: ComponentFixture<FormEditorComponent<any>>;

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

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
