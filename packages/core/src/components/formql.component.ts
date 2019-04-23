import { OnDestroy, ViewChild, Component, ViewContainerRef, ComponentFactoryResolver,
        Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormWindow, FormError, FormState } from '../models/form-window.model';
import { InternalEventHandlerService } from '../services/internal-event-handler.service';
import { InternalEventHandler, InternalEventType } from '../models/internal-event.model';
import { HelperService } from '../services/helper.service';
import { FormComponent } from '../models/form-component.model';
import { StoreService } from '../services/store.service';
import { FormQLMode } from '../models/type.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActionHandlerService } from '../services/action-handler.service';
import { FormActionType, FormAction } from '../models/action.model';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'formql',
    styleUrls: ['./formql.component.scss'],
    template: `<div *ngIf="error" class="fql-error-message">
                    <h4>{{error?.title}}</h4>
                    <span>{{error?.message}}</span>
               </div>
               <ng-container #target></ng-container>`
})
export class FormQLComponent implements OnDestroy, OnInit {
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

    @ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;

    private componentDestroyed = new Subject();

    form: FormWindow;
    data: any;

    data$ = this.storeService.getData();
    formState$ = this.storeService.getFormState();

    error: FormError;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef,
        private internalEventHandlerService: InternalEventHandlerService,
        private actionHandlerService: ActionHandlerService,
        private storeService: StoreService
    ) {
    }

    ngOnInit() {
        if (this.mode === FormQLMode.Edit)
            this.loadInternalEventHandlers();

        this.loadActionHandlers();

        this.formState$.pipe(takeUntil(this.componentDestroyed)).subscribe(formState => {
            this.loadForm(formState);
        });
        this.data$.pipe(takeUntil(this.componentDestroyed)).subscribe(data => this.data = data);
        this.storeService.getAll(this.formName, this.ids);
    }

    ngOnDestroy() {
        this.componentDestroyed.next();
        this.componentDestroyed.complete();
        this.storeService.destroyStore();
    }

    loadForm(formState: FormState) {
        this.form = formState.form;
        this.reactiveForm = formState.reactiveForm;

        if (this.target)
            this.target.clear();

        const componentRef = this.vcRef.createComponent(
            HelperService.getFactory(this.componentFactoryResolver, formState.form.layoutComponentName));

        const component = (<any>componentRef);
        component.instance.form = formState.form;
        component.instance.reactiveForm = formState.reactiveForm;
        component.instance.mode = this.mode;

        this.target.insert(component.hostView);

        this.formLoaded.emit(true);
    }

    saveForm() {
        this.storeService.saveForm();
    }

    saveData() {
        this.formSaveStart.emit(true);
        this.storeService.saveData().subscribe(response => {
            this.formSaveEnd.emit(true);
        },
        error => {
            this.formError.emit(error);
        });
    }

    loadInternalEventHandlers() {
        this.internalEventHandlerService.event.pipe(takeUntil(this.componentDestroyed)).subscribe(response => {
            this.storeService.reSetForm((<InternalEventHandler>response).eventType, response.event);
        });
    }

    resetForm(objectId: string) {
        this.storeService.reSetForm(InternalEventType.EditingForm, objectId);
    }

    refreshComponent(component: FormComponent<any>) {
        this.storeService.setComponet(component);
    }

    loadActionHandlers() {
        this.actionHandlerService.action.pipe(takeUntil(this.componentDestroyed)).subscribe(response => {
            const actionHandler = <FormAction>response;

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
        });
    }
}
