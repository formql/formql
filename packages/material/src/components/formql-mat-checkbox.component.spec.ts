import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLMatCheckboxComponent } from './formql-mat-checkbox.component';
import { CommonModule } from '@angular/common';
import { FormQLInternalMaterialModule } from '../formql-internal-material';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormQLMatCheckboxComponent', () => {
  let component: FormQLMatCheckboxComponent;
  let fixture: ComponentFixture<FormQLMatCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormQLInternalMaterialModule,
        ReactiveFormsModule],
      declarations: [FormQLMatCheckboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLMatCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
