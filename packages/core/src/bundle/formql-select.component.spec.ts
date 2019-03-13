import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLSelectComponent } from './formql-select.component';

describe('FormQLSelectComponent', () => {
  let component: FormQLSelectComponent;
  let fixture: ComponentFixture<FormQLSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQLSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
