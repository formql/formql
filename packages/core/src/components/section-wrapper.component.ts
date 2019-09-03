import { Component, Input, ViewEncapsulation, ViewChild, ViewContainerRef, OnInit, ComponentFactoryResolver } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormSection } from '../models/form-section.model';
import { InternalEventHandlerService } from '../services/internal-event-handler.service';
import { InternalEventType } from '../models/internal-event.model';
import { FormPage } from '../models/form-page.model';
import { HelperService } from '../services/helper.service';
import { FormQLMode, ContainerType } from '../models/type.model';
import { GridPositionType } from '../models/style.model';

@Component({
    // tslint:disable-next-line: component-selector
    selector: '[formql-section-wrapper]',
    template: `
        <div #wrapper formqlDnd
            [sourceObjectId]="section.sectionId"
            [attr.sectionId]="section.sectionId"
            [sourceWrapperId]="page.pageId"
            [type]="ContainerType.Section"
            [mode]="mode"
            [ngClass]="[(mode === FormQLMode.Edit) ? 'fql-section-wrapper-edit' : 'fql-section-wrapper']">
            <div class="fql-section-tooltip">
                <ng-container #tooltip></ng-container>
            </div>
            <div *ngIf="!section.template.header.hidden" class="fql-section-header">
                <ng-template formqlGdConfig
                    [formqlGdConfigOf]="section.template.header" let-headeritem let-i="index">
                    <div formql-section-container
                        [positionId]="headeritem.id"
                        [positionType]="ComponentPositionType.Header"
                        [ngStyle]="headeritem.style"
                        [page]="page"
                        [section]="section"
                        [reactiveSection]="reactiveSection"
                        [mode]="mode">
                    </div>
                </ng-template>
            </div>
            <div *ngIf="!section.template.body.hidden" class="fql-section-body">
                <ng-template formqlGdConfig
                    [formqlGdConfigOf]="section.template.body" let-bodyitem let-i="index">
                    <div formql-section-container
                        [positionId]="bodyitem.id"
                        [positionType]="ComponentPositionType.Body"
                        [ngStyle]="bodyitem.style"
                        [page]="page"
                        [section]="section"
                        [reactiveSection]="reactiveSection"
                        [mode]="mode">
                    </div>
                </ng-template>
            </div>
        </div>`,
    styleUrls: ['./section-wrapper.component.scss']
})
export class SectionWrapperComponent implements OnInit {

    @ViewChild('wrapper', { read: ViewContainerRef, static : false }) wrapper: ViewContainerRef;
    @ViewChild('tooltip', { read: ViewContainerRef, static : false }) tooltip: ViewContainerRef;

    @Input() section: FormSection;
    @Input() reactiveSection: FormGroup;
    @Input() page: FormPage;
    @Input() mode: FormQLMode;

    error: string;

    public FormQLMode = FormQLMode;
    public ContainerType = ContainerType;
    public ComponentPositionType = GridPositionType;

    constructor(
        private internalEventHandlerService: InternalEventHandlerService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef
    ) {}

    ngOnInit() {

        if (this.mode === FormQLMode.Edit) {
            const tooltip = this.viewContainerRef.createComponent(
                HelperService.getFactory(this.componentFactoryResolver, 'TooltipComponent'));
            (<any>tooltip).instance.wrapper = this.wrapper;
            (<any>tooltip).instance.type = ContainerType.Section;
            (<any>tooltip).instance.object = this.section;
            this.tooltip.insert(tooltip.hostView);
        }
    }

    editField() {
        if (this.mode === FormQLMode.Edit)
            this.internalEventHandlerService.send(InternalEventType.EditingSection, this.section);
    }

}
