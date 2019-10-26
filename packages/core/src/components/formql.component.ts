import {
  ViewChild, Component, ViewContainerRef,
  Input, Output, EventEmitter, ChangeDetectionStrategy, AfterViewInit, OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormWindow, FormError } from '../models/form-window.model';
import { InternalEventHandlerService } from '../services/internal-event-handler.service';
import { InternalEventType } from '../models/internal-event.model';
import { FormComponent } from '../models/form-component.model';
import { StoreService } from '../services/store.service';
import { FormQLMode } from '../models/type.model';
import { ActionHandlerService } from '../services/action-handler.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'formql',
  styleUrls: ['./formql.component.scss'],
  template: `<div *ngIf="error" class="fql-error-message">
                <h4>{{error?.title}}</h4>
                <span>{{error?.message}}</span>
              </div>
              <formql-layout-loader
                [formState]="formState$ | async"
                [actionHandler]= "actionHandler$ | async"
                [internalEventHandler]="internalEventHandler$ | async"
                [reactiveForm]="reactiveForm"
                [mode]="mode"
                (formSaveStart)="formSaveStart.emit(true)"
                (formSaveEnd)="formSaveEnd.emit(true)"
                (formError)="formError.emit(true)">
              </formql-layout-loader>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormQLComponent implements AfterViewInit, OnDestroy {
  static componentName = 'FormQLComponent';

  @Input() formName: string;
  @Input() ids: Array<string>;
  @Input() mode: FormQLMode = FormQLMode.View;

  @Input() reactiveForm: FormGroup;
  @Input() customMetadata: any;

  @Output() formLoaded: EventEmitter<boolean> = new EventEmitter();
  @Output() formSaveStart: EventEmitter<boolean> = new EventEmitter();
  @Output() formSaveEnd: EventEmitter<boolean> = new EventEmitter();
  @Output() formError: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('target', { read: ViewContainerRef, static: true }) target: ViewContainerRef;

  data: any;
  form: FormWindow;

  data$ = this.storeService.getData();
  formState$ = this.storeService.getFormState();
  actionHandler$ = this.actionHandlerService.action;
  internalEventHandler$ = this.internalEventHandlerService.event;

  error: FormError;

  private componentDestroyed = new Subject();

  constructor(
    private internalEventHandlerService: InternalEventHandlerService,
    private actionHandlerService: ActionHandlerService,
    private storeService: StoreService
  ) { }

  ngAfterViewInit(): void {
    this.data$.pipe(takeUntil(this.componentDestroyed)).subscribe( data => this.data = data);
    this.formState$.pipe(takeUntil(this.componentDestroyed)).
        subscribe(formState => formState && formState.form ? this.form = formState.form : this.form = null);
    this.storeService.getAll(this.formName, this.ids);
  }

  resetForm(objectId: string) {
    this.storeService.reSetForm(InternalEventType.EditingForm, objectId);
  }

  refreshComponent(component: FormComponent<any>) {
    this.storeService.setComponet(component);
  }

  saveForm() {
    this.storeService.saveForm();
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }
}
