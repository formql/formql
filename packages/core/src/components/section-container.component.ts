import { Component, Input } from '@angular/core';
import { Section } from '../models/section.model';
import { FormGroup } from '@angular/forms';
import { ComponentPositionType, FormComponent } from '../models/form-component.model';
import { DndService } from '../services/dnd.service';
import { Page } from '../models/page.model';
import { FormQLMode } from '../models/formql-mode.model';
import { WrapperType } from '../models/wrapper-type.model';
import { DndEvent } from '../models/dnd.model';
import { DndTransfer } from '../models/dnd.model';

@Component({
    selector: '[sectionContainer]',
    template: `
    <div dnd-drop [type]="WrapperType.Component" 
        [mode]="mode"
        [positionType]="positionType"
        *ngIf="(mode == FormQLMode.Edit || mode == FormQLMode.LiveEdit)" class="fql-section-container"
        (synchronise)="synchroniseModel($event)"> 
        <ng-container *ngFor="let component of components">
            <div componentContainer
                [ngClass]="{'fql-component-container-hidden': component.properties?.hidden?.value}"
                [component]="component"
                [sectionId]="section.sectionId"
                [value]="component.value"
                [reactiveSection]="reactiveSection"
                [mode]="mode"></div>
        </ng-container>
    </div>
    <div *ngIf="!(mode == FormQLMode.Edit || mode == FormQLMode.LiveEdit)">
        <ng-container *ngFor="let component of components">
            <div componentContainer *ngIf="!component.properties?.hidden?.value" 
                [component]="component"
                [sectionId]="section.sectionId"
                [value]="component.value" 
                [reactiveSection]="reactiveSection"
                [mode]="mode"></div>
        </ng-container>
    </div>`,
    styleUrls: ['./section-container.component.scss'],
    providers: [DndService]
})
export class SectionContainerComponent {

    @Input() page: Page;
    @Input() section: Section;
	@Input() reactiveSection: FormGroup;
    @Input() positionType: ComponentPositionType;
    @Input() positionId: string;
    @Input() mode: FormQLMode;

    public FormQLMode = FormQLMode;
    public WrapperType = WrapperType;

    components: FormComponent<any>[] = [];
	constructor(
        private dndService: DndService
	) {}
    
    ngOnInit() {
        this.components = this.findColumnComponents();
    }

    synchroniseModel($event: DndTransfer) {
        let dndEvent = <DndEvent>{
            sourceObjectId: $event.sourceObjectId,
            sourceWrapperId: $event.sourceWrapperId,
            targetPositionId: this.positionId,
            targetWrapperId: this.section.sectionId,
            targetIndexId: $event.targetIndexId,
            positionType: this.positionType
        };
        this.dndService.synchroniseSectionModel(this.page, dndEvent);
    }

    private findColumnComponents(): FormComponent<any>[] {
		let columnComponents: FormComponent<any>[] = [];
        if (this.section.components)
        {
            this.section.components.forEach(field => {
                if (field.position.id === this.positionId && field.position.type == this.positionType) {
                    columnComponents.push(field);
                }
            });
        }
        
		columnComponents.sort((left: FormComponent<any>, right: FormComponent<any>) => {
			return left.position.index - right.position.index;
        });
        
        return columnComponents;
	}
}
