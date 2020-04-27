import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormComponent } from '../models/form-component.model';
import { FormError, FormState, FormWindow } from '../models/form-window.model';
import { InternalEventType } from '../models/internal-event.model';
import { FormQLMode } from '../models/type.model';
import { StoreService } from '../services/store.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'formql',
  styleUrls: ['./formql.component.scss'],
  template: `<div *ngIf="error" class="fql-error-message">
                <h4>{{error?.title}}</h4>
                <span>{{error?.message}}</span>
              </div>
              <formql-layout-loader
                [formState]="formState"
                (formSaveStart)="formSaveStart.emit(true)"
                (formSaveEnd)="formSaveEnd.emit(true)"
                (formError)="formError.emit(true)">
              </formql-layout-loader>`
})
export class FormQLComponent implements OnInit, OnDestroy {
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
  formState: FormState;

  data$ = this.storeService.getData();
  formState$ = this.storeService.getFormState();
  error: FormError;

  private componentDestroyed = new Subject();

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.componentDestroyed)).subscribe(data => this.data = data);
    this.formState$.pipe(takeUntil(this.componentDestroyed)).
        subscribe((formState) => {
          if (formState) {
            this.formState = {...formState};

            if (formState.form)
              this.form = formState.form;
          }
        });
    this.storeService.getAll(this.formName, this.ids, this.mode);
  }

  resetForm(objectId: string) {
    this.storeService.reSetForm(InternalEventType.EditingForm, objectId);
  }

  refreshComponent(component: FormComponent<any>) {
    this.storeService.setComponent(component);
  }

  saveForm() {
    this.storeService.saveForm();
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }
}
