import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLMatTextareaComponent } from './formql-mat-textarea.component';

describe('FormQLMatTextareaComponent', () => {
  let component: FormQLMatTextareaComponent;
  let fixture: ComponentFixture<FormQLMatTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQLMatTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLMatTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
