import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSectionValidatorComponent } from './form-section-validator.component';

describe('FormSectionValidatorComponent', () => {
  let component: FormSectionValidatorComponent;
  let fixture: ComponentFixture<FormSectionValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSectionValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSectionValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
