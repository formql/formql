import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLLabelComponent } from './formql-label.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormQLLabelComponent', () => {
  let component: FormQLLabelComponent;
  let fixture: ComponentFixture<FormQLLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [ FormQLLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
