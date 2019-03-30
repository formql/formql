import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLMatDatepickerComponent } from './formql-mat-datepicker.component';

describe('FormQLMatDatepickerComponent', () => {
    let component: FormQLMatDatepickerComponent;
    let fixture: ComponentFixture<FormQLMatDatepickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormQLMatDatepickerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormQLMatDatepickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
