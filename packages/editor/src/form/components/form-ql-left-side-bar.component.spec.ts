import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQlLeftSideBar } from './form-ql-left-side-bar.component';

describe('FormQlLeftSideBar', () => {
  let component: FormQlLeftSideBar;
  let fixture: ComponentFixture<FormQlLeftSideBar>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQlLeftSideBar ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQlLeftSideBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
