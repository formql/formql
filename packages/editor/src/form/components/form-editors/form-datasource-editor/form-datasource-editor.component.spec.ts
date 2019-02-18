import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDatasourceEditorComponent } from './form-datasource-editor.component';

describe('FormDatasourceEditorComponent', () => {
  let component: FormDatasourceEditorComponent;
  let fixture: ComponentFixture<FormDatasourceEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDatasourceEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDatasourceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
