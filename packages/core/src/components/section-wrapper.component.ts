import { Component, Input, ViewEncapsulation, ViewChild, ViewContainerRef, OnInit, ComponentFactoryResolver } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Section } from '../models/section.model';
import { InternalEventHandlerService } from '../services/internal-event-handler.service';
import { InternalEventType } from '../models/internal-event-handler.model';
import { Page } from '../models/page.model';
import { ComponentPositionType } from '../models/form-component.model';
import { FormQLMode } from '../models/formql-mode.model';
import { HelperService } from '../services/helper.service';
import { WrapperType } from '../models/wrapper-type.model';


@Component({
    selector: '[sectionWrapper]',
    template: `
        <div #wrapper dnd 
            [sourceObjectId]="section.sectionId" 
            [attr.sectionId]="section.sectionId"
            [sourceWrapperId]="page.pageId"
            [type]="WrapperType.Section" 
            [mode]="mode"
            [ngClass]="[(mode == FormQLMode.Edit || mode == FormQLMode.LiveEdit) ? 'fql-section-wrapper-edit' : 'fql-section-wrapper']">
            <div class="fql-section-tooltip">
                <ng-container #tooltip></ng-container>
            </div>
            <div class="fql-section-header">
                <ng-template gdConfig 
                    [gdConfigOf]="section.template.header" let-headeritem let-i="index">
                    <div sectionContainer 
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
            <div class="fql-section-body">
                <ng-template gdConfig 
                    [gdConfigOf]="section.template.body" let-bodyitem let-i="index">
                    <div sectionContainer  
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
    styleUrls: ['./section-wrapper.component.scss'],
    //encapsulation: ViewEncapsulation.None,
})
export class SectionWrapperComponent implements OnInit {

    @ViewChild('wrapper', { read: ViewContainerRef }) wrapper: ViewContainerRef;
    @ViewChild('tooltip', { read: ViewContainerRef }) tooltip: ViewContainerRef;

    @Input() section: Section;
    @Input() reactiveSection: FormGroup;
    @Input() page: Page;
    @Input() mode: FormQLMode;

    error: string;
    
    public FormQLMode = FormQLMode;
    public WrapperType = WrapperType;
    public ComponentPositionType = ComponentPositionType;

    constructor(
        private internalEventHandlerService: InternalEventHandlerService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef
    ) {}

    ngOnInit() {
       
        if (this.mode == FormQLMode.Edit || this.mode == FormQLMode.LiveEdit)
        {
            const tooltip = this.viewContainerRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, "TooltipComponent"));
            (<any>tooltip).instance.wrapper = this.wrapper;
            (<any>tooltip).instance.type = WrapperType.Section;
            (<any>tooltip).instance.object = this.section;
            this.tooltip.insert(tooltip.hostView);
        }
    }

    editField() {
        if (this.mode == FormQLMode.Edit || this.mode == FormQLMode.LiveEdit)
            this.internalEventHandlerService.send(InternalEventType.EditingSection, this.section);
    }

}
