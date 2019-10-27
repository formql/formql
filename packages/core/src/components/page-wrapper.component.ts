import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormPage } from '../models/form-page.model';
import { FormGroup } from '@angular/forms';
import { DndService } from '../services/dnd.service';
import { FormQLMode, ContainerType } from '../models/type.model';
import { GridPositionType } from '../models/style.model';
import { DndTransfer, DndEvent } from '../models/dnd.model';
import { StoreService } from '../services/store.service';
import { InternalEventType } from '../models/internal-event.model';
import { FormSection, SectionGroup } from '../models/form-section.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[formql-page-wrapper]',
  template: `
      <div class="fql-page-body">
        <ng-template formqlGdConfig [formqlGdConfigOf]="page.template.body" let-bodyitem let-i="index"
          (resetItems)="resetSections()">
          <div class="fql-section-container" [ngStyle]="bodyitem.style">
            <div formqlDndDrop [type]="ContainerType.Section" [mode]="mode"
              [ngClass]="{'fql-page-container': (mode === FormQLMode.Edit)}"
              (synchronise)="synchroniseModel($event, bodyitem.id)">
              <ng-container *ngFor="let section of sections[bodyitem.id]; trackBy: trackByFn">
                <ng-container *ngTemplateOutlet="templateRef; context: {section: section}">
                </ng-container>
              </ng-container>
            </div>
          </div>
        </ng-template>
      </div>
      <ng-template #templateRef let-section="section">
        <div [formGroup]="reactivePage">
          <div formql-section-wrapper [page]="page" [section]="section" [formGroupName]="section.sectionId"
            [reactiveSection]="reactivePage.controls[section.sectionId]" [mode]="mode">
          </div>
        </div>
      </ng-template>`,
  styleUrls: ['./page-wrapper.component.scss'],
  providers: [DndService]
})
export class PageWrapperComponent implements OnInit {

  @Input() public page: FormPage;
  @Input() public reactivePage: FormGroup;
  @Input() public mode: FormQLMode;

  public FormQLMode = FormQLMode;
  public ContainerType = ContainerType;
  public ComponentPositionType = GridPositionType;

  error: string;
  row: any;
  sections: SectionGroup;

  constructor(
    private dndService: DndService,
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.sections = this.createSections(this.page);
  }

  synchroniseModel($event: DndTransfer, positionId: string) {
    const dndEvent = <DndEvent>{
      sourceObjectId: $event.sourceObjectId,
      sourceWrapperId: $event.sourceWrapperId,
      targetPositionId: positionId,
      targetWrapperId: this.page.pageId,
      targetIndexId: $event.targetIndexId
    };
    this.page = this.dndService.synchronisePageModel(this.page, dndEvent);
    this.sections = this.createSections(this.page);
    this.storeService.reSetForm(InternalEventType.DndFormChanged, this.page);
  }

  private createSections(page: FormPage): SectionGroup {
    const sections = <SectionGroup>{};
    if (page && page.sections)
      page.sections.forEach(section => {
        if (sections && sections[section.position.id])
          sections[section.position.id].push(section);
        else
          sections[section.position.id] = [section];
      });

    return sections;
  }

  trackByFn(index, item) {
    return item.id;
  }

  resetSections() {
    if (this.sections)
      this.sections = this.createSections(this.page);
  }

  log(obj) {
    console.log(obj);
  }
}
