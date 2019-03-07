import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Page } from '../models/page.model';
import { FormGroup } from '@angular/forms';
import { DndService } from '../services/dnd.service';
import { FormQLMode } from '../models/formql-mode.model';

@Component({
  selector: '[pageWrapper]',
  template: `<div class="fql-page-body">
                <ng-template gdConfig [gdConfigOf]="page.template.body" let-bodyitem let-i="index">
                    <div pageContainer class="fql-section-container"
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
  //encapsulation: ViewEncapsulation.None
})
export class PageWrapperComponent {

  @Input() public page: Page;
  @Input() public reactivePage: FormGroup;
  @Input() public mode: FormQLMode;

  error: string;
  row: any;

  constructor(
    private dndService: DndService
  ) { 
    
  }

  
}
