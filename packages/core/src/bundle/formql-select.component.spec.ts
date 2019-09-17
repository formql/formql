import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLSelectComponent } from './formql-select.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormQLSelectComponent', () => {
  let component: FormQLSelectComponent;
  let fixture: ComponentFixture<FormQLSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [ FormQLSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
