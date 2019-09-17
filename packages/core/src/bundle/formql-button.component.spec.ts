import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLButtonComponent } from './formql-button.component';

describe('TextboxReactiveComponent', () => {
  let component: FormQLButtonComponent;
  let fixture: ComponentFixture<FormQLButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQLButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
