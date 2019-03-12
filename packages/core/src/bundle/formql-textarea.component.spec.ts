import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLTextareaComponent } from './formql-textarea.component';

describe('FormQLTextareaComponent', () => {
  let component: FormQLTextareaComponent;
  let fixture: ComponentFixture<FormQLTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQLTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
