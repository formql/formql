import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEditorComponent } from './section-editor.component';

describe('SectionEditorComponent', () => {
  let component: SectionEditorComponent;
  let fixture: ComponentFixture<SectionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
