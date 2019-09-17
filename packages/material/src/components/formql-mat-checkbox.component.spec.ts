import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLMatCheckboxComponent } from './formql-mat-checkbox.component';

describe('FormQLMatCheckboxComponent', () => {
    let component: FormQLMatCheckboxComponent;
    let fixture: ComponentFixture<FormQLMatCheckboxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormQLMatCheckboxComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormQLMatCheckboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    test('should create', () => {
        expect(component).toBeTruthy();
    });
});
