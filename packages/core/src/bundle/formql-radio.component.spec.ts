import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLRadioComponent } from './formql-radio.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormQLRadioComponent', () => {
  let component: FormQLRadioComponent;
  let fixture: ComponentFixture<FormQLRadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [ FormQLRadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
