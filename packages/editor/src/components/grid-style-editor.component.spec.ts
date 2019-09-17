import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridStyleEditorComponent } from './grid-style-editor.component';

describe('GridStyleEditorComponent', () => {
  let component: GridStyleEditorComponent;
  let fixture: ComponentFixture<GridStyleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridStyleEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridStyleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
