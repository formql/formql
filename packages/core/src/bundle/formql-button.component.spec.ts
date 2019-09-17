import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLButtonComponent } from './formql-button.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('TextboxReactiveComponent', () => {
  let component: FormQLButtonComponent;
  let fixture: ComponentFixture<FormQLButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [ FormQLButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
