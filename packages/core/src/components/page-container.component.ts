import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Page } from '../models/page.model';
import { Section } from '../models/section.model';
import { FormGroup } from '@angular/forms';
import { FormQLMode } from '../models/formql-mode.model';
import { DndService } from '../services/dnd.service';
import { WrapperType } from '../models/wrapper-type.model';
import { ComponentPositionType } from '../models/form-component.model';
import { DndEvent } from '../models/dnd-event.model';
import { DndTransfer } from '../models/dnd-transfer.model';


@Component({
    selector: '[pageContainer]',
    template: `
    <div dnd-drop 
        [type]="WrapperType.Section" 
        [mode]="mode" 
        [ngClass]="{'fql-page-container': (mode == FormQLMode.Edit || mode == FormQLMode.LiveEdit)}"
        (synchronise)="synchroniseModel($event)">
        <ng-container *ngFor="let section of sections">
            <div [formGroup]="reactivePage">
                <div sectionWrapper 
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

    @Input() page: Page;
    @Input() reactivePage: FormGroup;
    @Input() positionId: string;
    @Input() mode: FormQLMode;

    sections: Section[] = [];

    public FormQLMode = FormQLMode;
    public WrapperType = WrapperType;
    public ComponentPositionType = ComponentPositionType;

    constructor(
        private dndService: DndService
    ) { }

    ngOnInit() {
        this.sections = this.findSections();
    }

    synchroniseModel($event: DndTransfer) {
        let dndEvent = <DndEvent>{
            sourceObjectId: $event.sourceObjectId,
            sourceWrapperId: $event.sourceWrapperId,
            targetPositionId: this.positionId,
            targetWrapperId: this.page.pageId,
            targetIndexId: $event.targetIndexId
        };
        this.dndService.synchronisePageModel(this.page, dndEvent);

    }

    private findSections(): Section[] {
        let sections: Section[] = [];
        for (let section of this.page.sections) {
            if (section.position.id === this.positionId) {
                sections.push(section);
            }
        }

        // column widgets
        return sections.sort((left: Section, right: Section) => {
            return left.position.index - right.position.index;
        });
    }

}
