import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLTextareaComponent } from './formql-textarea.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormQLTextareaComponent', () => {
  let component: FormQLTextareaComponent;
  let fixture: ComponentFixture<FormQLTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [FormQLTextareaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
