import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLInputComponent } from './formql-input.component';

describe('FormQLInputComponent', () => {
  let component: FormQLInputComponent;
  let fixture: ComponentFixture<FormQLInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQLInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
