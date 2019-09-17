import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLMatButtonComponent } from './formql-mat-button.component';
import { CommonModule } from '@angular/common';
import { FormQLInternalMaterialModule } from '../formql-internal-material';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormQLMatButtonComponent', () => {
  let component: FormQLMatButtonComponent;
  let fixture: ComponentFixture<FormQLMatButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormQLInternalMaterialModule,
        ReactiveFormsModule],
      declarations: [FormQLMatButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLMatButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    console.log('component = ' + component);
    expect(component).toBeTruthy();
  });
});
