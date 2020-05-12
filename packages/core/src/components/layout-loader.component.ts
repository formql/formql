import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { FormAction, FormActionType } from '../models/action.model';
import { InternalEventHandler } from '../models/internal-event.model';
import { FormQLMode } from '../models/type.model';
import { ActionHandlerService } from '../services/action-handler.service';
import { ComponentResolverService } from '../services/component-resolver.service';
import { InternalEventHandlerService } from '../services/internal-event-handler.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'formql-layout-loader',
  template: `<ng-container #target></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutLoaderComponent implements OnDestroy {
  @ViewChild('target', { read: ViewContainerRef, static: true }) target: ViewContainerRef;

  formLoaded = false;
  private componentDestroyed = new Subject();

  @Input()
  set formState(formState) {
    if (!this.formLoaded && formState && formState.form) {
      if (this.target) this.target.clear();

      const componentRef = this.vcRef.createComponent(
        this.componentResolverService.resolveComponent(formState.form.layoutComponentName)
      );
      const component = <any>componentRef;
      component.instance.form = formState.form;
      component.instance.reactiveForm = formState.reactiveForm;
      component.instance.mode = formState.mode;

      if (formState.mode === FormQLMode.Edit)
        this.internalEventHandlerService.event.subscribe((response) => this.internalEventHandler(response));

      this.target.insert(component.hostView);

      this.formLoaded = true;
    }
  }

  @Output() submit = new EventEmitter();
  @Output() formSaveStart: EventEmitter<boolean> = new EventEmitter();
  @Output() formSaveEnd: EventEmitter<boolean> = new EventEmitter();
  @Output() formError: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private vcRef: ViewContainerRef,
    private componentResolverService: ComponentResolverService,
    private storeService: StoreService,
    private internalEventHandlerService: InternalEventHandlerService,
    private actionHandlerService: ActionHandlerService
  ) {
    this.actionHandlerService.action.subscribe((response) => this.actionHandler(response));
  }

  onSubmitTriggered() {
    this.submit.emit(null);
  }

  saveData() {
    this.formSaveStart.emit(true);
    this.storeService.saveData().subscribe(
      (response) => {
        this.formSaveEnd.emit(true);
      },
      (error) => {
        this.formError.emit(error);
      }
    );
  }

  actionHandler(actionHandler: FormAction) {
    if (actionHandler)
      switch (actionHandler.key) {
        case FormActionType.Save:
          this.saveData();
          break;

        case FormActionType.Validate:
          this.storeService.validateForm();
          break;

        case FormActionType.ValidateAndSave:
          this.storeService.validateForm();
          if (this.storeService.isFormValid()) this.saveData();
          break;
      }
  }

  internalEventHandler(response: InternalEventHandler) {
    if (response) this.storeService.reSetForm(response.eventType, response.event);
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }
}
