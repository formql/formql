import { Component, Input, Output, EventEmitter, ViewChild,
         ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HelperService } from '../services/helper.service';
import { ComponentResolverService } from '../services/component-resolver.service';
import { StoreService } from '../services/store.service';
import { FormActionType } from '../models/action.model';
import { InternalEventHandler } from '../models/internal-event.model';
import { take } from 'rxjs/operators';
import { FormQLMode } from '../models/type.model';

@Component({
  selector: 'formql-layout-loader',
  template: `<ng-container #target></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutLoaderComponent {
  @ViewChild('target', { read: ViewContainerRef, static: true }) target: ViewContainerRef;

  formLoaded = false;

  @Input() reactiveForm: FormGroup;
  @Input() mode: FormQLMode;

  @Input()
  set actionHandler(actionHandler) {
    if (actionHandler) {
      switch (actionHandler.key) {
        case FormActionType.Save:
          this.saveData();
          break;

        case FormActionType.Validate:
          this.storeService.validateForm();
          break;

        case FormActionType.ValidateAndSave:
          this.storeService.validateForm();
          if (this.storeService.isFormValid())
            this.saveData();
          break;
      }
    }
  }

  @Input()
  set formState(formState) {
    if (!this.formLoaded && formState && formState.form) {
      if (this.target)
        this.target.clear();

      const componentRef = this.vcRef.createComponent(
        HelperService.getFactory(this.componentResolverService, formState.form.layoutComponentName));

      const component = (<any>componentRef);
      component.instance.form = formState.form;
      component.instance.reactiveForm = formState.reactiveForm;
      component.instance.mode = this.mode;

      this.target.insert(component.hostView);

      this.formLoaded = true;
    }
  }

  @Input()
  set internalEventHandler(response) {
    if (this.mode !== FormQLMode.View && response)
      this.storeService.reSetForm((<InternalEventHandler>response).eventType, response.event);
  }

  @Output() submit = new EventEmitter();
  @Output() formSaveStart: EventEmitter<boolean> = new EventEmitter();
  @Output() formSaveEnd: EventEmitter<boolean> = new EventEmitter();
  @Output() formError: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private vcRef: ViewContainerRef,
    private componentResolverService: ComponentResolverService,
    private storeService: StoreService
  ) {}

  onSubmitTriggered() {
    this.submit.emit(null);
  }

  saveData() {
    this.formSaveStart.emit(true);
    this.storeService.saveData().pipe(take(1)).subscribe(response => {
      this.formSaveEnd.emit(true);
    },
    error => {
      this.formError.emit(error);
    });
  }
}
