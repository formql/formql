import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLMatButtonComponent } from './formql-mat-button.component';

describe('FormQLMatButtonComponent', () => {
    let component: FormQLMatButtonComponent;
    let fixture: ComponentFixture<FormQLMatButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormQLMatButtonComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormQLMatButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
