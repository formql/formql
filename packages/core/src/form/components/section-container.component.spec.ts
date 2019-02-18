import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionContainerComponent } from './section-container.component';

describe('SectionContainerComponent', () => {
  let component: SectionContainerComponent;
  let fixture: ComponentFixture<SectionContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
