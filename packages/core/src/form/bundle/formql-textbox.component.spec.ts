import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLTextBoxComponent } from './formql-textbox.component';

describe('FormQLTextBoxComponent', () => {
  let component: FormQLTextBoxComponent;
  let fixture: ComponentFixture<FormQLTextBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQLTextBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQLTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
