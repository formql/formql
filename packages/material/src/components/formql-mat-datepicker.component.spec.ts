import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLMatDatepickerComponent } from './formql-mat-datepicker.component';
import { CommonModule } from '@angular/common';
import { FormQLInternalMaterialModule } from '../formql-internal-material';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormQLMatDatepickerComponent', () => {
  let component: FormQLMatDatepickerComponent;
  let fixture: ComponentFixture<FormQLMatDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormQLInternalMaterialModule,
        ReactiveFormsModule],
      declarations: [FormQLMatDatepickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLMatDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
