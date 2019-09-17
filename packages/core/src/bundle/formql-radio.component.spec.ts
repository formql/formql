import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLRadioComponent } from './formql-radio.component';

describe('FormQLRadioComponent', () => {
  let component: FormQLRadioComponent;
  let fixture: ComponentFixture<FormQLRadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
