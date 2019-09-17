import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQLMatTextareaComponent } from './formql-mat-textarea.component';
import { CommonModule } from '@angular/common';
import { FormQLInternalMaterialModule } from '../formql-internal-material';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FormQLMatTextareaComponent', () => {
    let component: FormQLMatTextareaComponent;
    let fixture: ComponentFixture<FormQLMatTextareaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule,
                      FormQLInternalMaterialModule,
                      ReactiveFormsModule,
                      BrowserAnimationsModule],
            declarations: [FormQLMatTextareaComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormQLMatTextareaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    test('textarea', () => {
        expect(component).toBeTruthy();
    });
});
