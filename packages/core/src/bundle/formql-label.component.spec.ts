import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLLabelComponent } from './formql-label.component';

describe('FormQLLabelComponent', () => {
  let component: FormQLLabelComponent;
  let fixture: ComponentFixture<FormQLLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
