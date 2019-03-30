import { Component, Input } from '@angular/core';
import { FormPage } from '../models/form-page.model';
import { FormGroup } from '@angular/forms';
import { DndService } from '../services/dnd.service';
import { FormQLMode } from '../models/type.model';

@Component({
    // tslint:disable-next-line: component-selector
    selector: '[formql-page-wrapper]',
    template: `<div class="fql-page-body">
                <ng-template formqlGdConfig [formqlGdConfigOf]="page.template.body" let-bodyitem let-i="index">
                    <div formql-page-container class="fql-section-container"
                        [positionId]="bodyitem.id"
                        [ngStyle]="bodyitem.style"
                        [page]="page"
                        [reactivePage]="reactivePage"
                        [mode]="mode">
                    </div>
                </ng-template>
            </div>`,
    styleUrls: ['./page-wrapper.component.scss'],
    providers: [DndService]
})
export class PageWrapperComponent {

    @Input() public page: FormPage;
    @Input() public reactivePage: FormGroup;
    @Input() public mode: FormQLMode;

    error: string;
    row: any;
}
