import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLMatFormFieldComponent } from './formql-mat-form-field.component';
import { TextMaskModule } from 'examples/01-starter-example/node_modules/angular2-text-mask/dist/angular2TextMask';
import { CommonModule } from '@angular/common';
import { FormQLInternalMaterialModule } from '../formql-internal-material';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormQLMatFormFieldComponent', () => {
    let component: FormQLMatFormFieldComponent;
    let fixture: ComponentFixture<FormQLMatFormFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule,
                      FormQLInternalMaterialModule,
                      ReactiveFormsModule],
            declarations: [FormQLMatFormFieldComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormQLMatFormFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    test('should create', () => {
        expect(component).toBeTruthy();
    });
});
