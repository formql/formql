import { Component, Input, ViewChild, ViewContainerRef, OnInit, ComponentFactoryResolver, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormSection } from '../models/form-section.model';
import { InternalEventHandlerService } from '../services/internal-event-handler.service';
import { InternalEventType } from '../models/internal-event.model';
import { FormPage } from '../models/form-page.model';
import { HelperService } from '../services/helper.service';
import { FormQLMode, ContainerType } from '../models/type.model';
import { GridPositionType } from '../models/style.model';
import { DndTransfer, DndEvent } from '../models/dnd.model';
import { DndService } from '../services/dnd.service';
import { StoreService } from '../services/store.service';
import { ComponentGroup, FormComponent } from '../models/form-component.model';

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
            <div *ngIf="section.template && !section.template.header.hidden" class="fql-section-header">
                <ng-template formqlGdConfig
                    [formqlGdConfigOf]="section.template.header" let-headeritem let-i="index">
                    <ng-container *ngTemplateOutlet="templateRef;
                      context: {
                        templateitem: headeritem,
                        positionType: ComponentPositionType.Header
                      }">
                    </ng-container>
                </ng-template>
            </div>
            <div *ngIf="section.template && !section.template.body.hidden" class="fql-section-body">
                <ng-template formqlGdConfig
                    [formqlGdConfigOf]="section.template.body" let-bodyitem let-i="index">
                    <ng-container *ngTemplateOutlet="templateRef;
                      context: {
                        templateitem: bodyitem,
                        positionType: ComponentPositionType.Body
                      }">
                    </ng-container>
                </ng-template>
            </div>
        </div>
        <ng-template #templateRef let-templateitem="templateitem" let-positionType="positionType">
          <div formqlDndDrop
              [ngStyle]="templateitem.style"
              [type]="ContainerType.Component"
              *ngIf="(mode === FormQLMode.Edit)"
              [mode]="mode"
              [positionType]="positionType"
              class="fql-section-container"
              (synchronise)="synchroniseModel($event, templateitem.id, positionType)">
              <ng-container *ngFor="let component of components[positionType + '_' + templateitem.id]; trackBy: trackByFn">
                  <div formql-component-container
                      [ngClass]="{'fql-component-container-hidden': component.rules?.hidden?.value}"
                      [component]="component"
                      [sectionId]="section.sectionId"
                      [value]="component.value"
                      [reactiveSection]="reactiveSection"
                      [mode]="mode"></div>
              </ng-container>
          </div>
          <div *ngIf="!(mode === FormQLMode.Edit)"
              [ngStyle]="templateitem.style">
              <ng-container *ngFor="let component of components[positionType + '_' + templateitem.id]; trackBy: trackByFn">
                  <div formql-component-container *ngIf="!component.rules?.hidden?.value"
                      [component]="component"
                      [sectionId]="section.sectionId"
                      [value]="component.value"
                      [reactiveSection]="reactiveSection"
                      [mode]="mode"></div>
              </ng-container>
          </div>
        </ng-template>
        `,
  styleUrls: ['./section-wrapper.component.scss']
})
export class SectionWrapperComponent implements OnInit {

  @ViewChild('wrapper', { read: ViewContainerRef, static: true }) wrapper: ViewContainerRef;
  @ViewChild('tooltip', { read: ViewContainerRef, static: true }) tooltip: ViewContainerRef;

  @Input() section: FormSection;
  @Input() reactiveSection: FormGroup;
  @Input() page: FormPage;
  @Input() mode: FormQLMode;

  error: string;
  components: ComponentGroup;

  public FormQLMode = FormQLMode;
  public ContainerType = ContainerType;
  public ComponentPositionType = GridPositionType;

  constructor(
    private internalEventHandlerService: InternalEventHandlerService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private dndService: DndService,
    private storeService: StoreService,
  ) { }

  ngOnInit() {

    this.components = this.createComponents(this.section);

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

  synchroniseModel($event: DndTransfer, positionId: string, positionType: GridPositionType) {
    const dndEvent = <DndEvent>{
      sourceObjectId: $event.sourceObjectId,
      sourceWrapperId: $event.sourceWrapperId,
      targetPositionId: positionId,
      targetWrapperId: this.section.sectionId,
      targetIndexId: $event.targetIndexId,
      positionType: positionType
    };
    this.page = this.dndService.synchroniseSectionModel(this.page, dndEvent);
    this.storeService.reSetForm(InternalEventType.DndFormChanged, this.page);
  }

  trackByFn(index, item) {
    return item.id;
  }

  private createComponents(section: FormSection): ComponentGroup {
    const components = <ComponentGroup>{};
    if (section && section.components)
      section.components.sort((left: FormComponent<any>, right: FormComponent<any>) => {
          return left.position.index - right.position.index;
      });

      section.components.forEach(component => {
        if (components && components[component.position.type + '_' + component.position.id])
          components[component.position.type + '_' + component.position.id].push(component);
        else
          components[component.position.type + '_' + component.position.id] = [component];
      });

    return components;
  }

}
