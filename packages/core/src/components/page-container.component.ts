import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormSection } from '../models/form-section.model';
import { FormGroup } from '@angular/forms';
import { DndService } from '../services/dnd.service';
import { DndEvent } from '../models/dnd.model';
import { DndTransfer } from '../models/dnd.model';
import { FormPage } from '../models/form-page.model';
import { FormQLMode, ContainerType } from '../models/type.model';
import { InternalEventHandlerService } from '../services/internal-event-handler.service';
import { InternalEventType } from '../models/internal-event.model';
import { GridPositionType } from '../models/style.model';
import { StoreService } from '../services/store.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: '[formql-page-container]',
    template: `
    <div formqlDndDrop
        [type]="ContainerType.Section"
        [mode]="mode"
        [ngClass]="{'fql-page-container': (mode === FormQLMode.Edit)}"
        (synchronise)="synchroniseModel($event)">
        <ng-container *ngFor="let section of sections">
            <div [formGroup]="reactivePage">
                <div formql-section-wrapper
                    [page]="page"
                    [section]="section"
                    [formGroupName]="section.sectionId"
                    [reactiveSection]="reactivePage.controls[section.sectionId]"
                    [mode]="mode">
                </div>
            </div>
        </ng-container>
    </div>`,
    styleUrls: ['page-container.component.scss'],
    providers: [DndService]
})
export class PageContainerComponent implements OnInit {

    @Input() page: FormPage;
    @Input() reactivePage: FormGroup;
    @Input() positionId: string;
    @Input() mode: FormQLMode;

    sections: FormSection[] = [];

    public FormQLMode = FormQLMode;
    public ContainerType = ContainerType;
    public ComponentPositionType = GridPositionType;

    constructor(
        private dndService: DndService,
        private storeService: StoreService,
        private eventHandlerService: InternalEventHandlerService
    ) { }

    ngOnInit() {
        this.sections = this.findSections();
    }

    synchroniseModel($event: DndTransfer) {
        const dndEvent = <DndEvent>{
            sourceObjectId: $event.sourceObjectId,
            sourceWrapperId: $event.sourceWrapperId,
            targetPositionId: this.positionId,
            targetWrapperId: this.page.pageId,
            targetIndexId: $event.targetIndexId
        };
        this.page = this.dndService.synchronisePageModel(this.page, dndEvent);
        this.storeService.reSetForm(InternalEventType.DndFormChanged, this.page);
        // this.eventHandlerService.send(InternalEventType.DndFormChanged, this.page);
    }

    private findSections(): FormSection[] {
        const sections: FormSection[] = [];
        if (this.page.sections) {
            this.page.sections.forEach(section => {
                if (section.position.id === this.positionId) {
                    sections.push(section);
                }
            });

            sections.sort((left: FormSection, right: FormSection) => {
                return left.position.index - right.position.index;
            });
        }
        return sections;
    }

}
