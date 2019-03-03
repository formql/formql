import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainLayoutComponent } from './plain-layout.component';

describe('PlainLayoutComponent', () => {
  let component: PlainLayoutComponent;
  let fixture: ComponentFixture<PlainLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlainLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
