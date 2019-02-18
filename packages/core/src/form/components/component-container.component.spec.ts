import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentContainerComponent } from './component-container.component';

describe('ComponentContainerComponent', () => {
  let component: ComponentContainerComponent;
  let fixture: ComponentFixture<ComponentContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
