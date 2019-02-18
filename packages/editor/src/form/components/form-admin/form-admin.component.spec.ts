import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdminComponent } from './form-admin.component';

describe('FormAdminComponent', () => {
  let component: FormAdminComponent;
  let fixture: ComponentFixture<FormAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
