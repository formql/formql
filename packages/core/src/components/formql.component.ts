import { OnDestroy, ViewChild, Component, ViewContainerRef, ComponentFactoryResolver,
        Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormWindow, FormError } from '../models/form-window.model';
import { InternalEventHandlerService } from '../services/internal-event-handler.service';
import { InternalEventHandler, InternalEventType } from '../models/internal-event.model';
import { HelperService } from '../services/helper.service';
import { FormComponent, ComponentControl } from '../models/form-component.model';
import { FormPage } from '../models/form-page.model';
import { StoreService } from '../services/store.service';
import { FormQLMode } from '../models/type.model';
import { FormSection } from '../models/form-section.model';
import { Observable, Subject } from 'rxjs';
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

    loading = true;
    saving = false;

    form: FormWindow;
    formControls: ComponentControl[];
    data: any;

    form$: Observable<FormWindow> ;
    components$: Observable<Array<FormComponent<any>>>;
    data$: Observable<any>;

    error: FormError;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef,
        private internalEventHandlerService: InternalEventHandlerService,
        private actionHandlerService: ActionHandlerService,
        private formBuilder: FormBuilder,
        private storeService: StoreService
    ) {
    }

    ngOnInit() {
        if (!this.reactiveForm)
            this.reactiveForm = this.formBuilder.group([]);

        if (this.mode === FormQLMode.Edit)
            this.loadInternalEventHandlers();

        this.loadActionHandlers();

        this.storeService.initialiseStore();

        this.form$ = this.storeService.getForm();
        this.components$ = this.storeService.getComponents();
        this.data$ = this.storeService.getData();

        this.form$.pipe(takeUntil(this.componentDestroyed)).subscribe(form => {
            if (form && !form.error) {
                this.form = form;

                this.components$.pipe(takeUntil(this.componentDestroyed)).subscribe(components => {
                    if (this.loading)
                        this.populateReactiveForm(false);

                    this.formControls = HelperService.resetValidators(components, this.formControls, this.componentFactoryResolver);

                    if (this.loading)
                        this.loadForm();
                });
                this.data$.pipe(takeUntil(this.componentDestroyed)).subscribe(data => this.data = data);
            } else
                this.error = {...form.error};
        });
        this.storeService.getAll(this.formName, this.ids);
    }

    ngOnDestroy() {
        this.componentDestroyed.next();
        this.componentDestroyed.complete();
        this.storeService.destroyStore();
    }

    loadForm() {
        if (this.target)
            this.target.clear();

        this.loading = false;
        const componentRef = this.vcRef.createComponent(
            HelperService.getFactory(this.componentFactoryResolver, this.form.layoutComponentName));

        const component = (<any>componentRef);
        component.instance.form = this.form;
        component.instance.reactiveForm = this.reactiveForm;
        component.instance.mode = this.mode;

        this.target.insert(component.hostView);

        this.formLoaded.emit(true);
    }

    saveForm() {
        this.storeService.saveForm(this.formName, this.form);
    }

    saveData() {
        this.formSaveStart.emit(true);
        this.storeService.saveData(this.ids).subscribe(response => {
            this.formSaveEnd.emit(true);
        },
        error => {
            this.formError.emit(error);
        });
    }

    loadInternalEventHandlers() {
        this.internalEventHandlerService.event.pipe(takeUntil(this.componentDestroyed)).subscribe(response => {
            const eventHandler = <InternalEventHandler>response;

            switch (eventHandler.eventType) {
                case InternalEventType.DndFormChanged:
                    const pageId = (<FormPage>response.event).pageId;
                    const indexDnd = this.form.pages.findIndex(p => p.pageId === pageId);

                    if (indexDnd >= 0)
                        this.form.pages[indexDnd] = response.event;

                    this.populateReactiveForm(true, pageId);
                break;

                case InternalEventType.RemoveComponent:
                    const componentId = (<FormComponent<any>>response.event).componentId;
                    let updateSectionId = '';
                    this.form.pages.forEach(page => {
                        page.sections.forEach(section => {
                            const indexComponent = section.components.findIndex(c => c.componentId === componentId);
                            if (indexComponent >= 0) {
                                section.components.splice(indexComponent, 1);
                                updateSectionId = section.sectionId;
                            }
                        });
                    });
                    this.populateReactiveForm(true, updateSectionId);
                break;

                case InternalEventType.RemoveSection:
                    const sectionId = (<FormSection>response.event).sectionId;
                    let updatePageId = '';
                    this.form.pages.forEach(page => {
                        const indexSection = page.sections.findIndex(c => c.sectionId === sectionId);
                        if (indexSection >= 0) {
                            page.sections.splice(indexSection, 1);
                            updatePageId = page.pageId;
                        }
                    });
                    this.populateReactiveForm(true, updatePageId);
                break;
            }
        });
    }

    loadActionHandlers() {
        this.actionHandlerService.action.pipe(takeUntil(this.componentDestroyed)).subscribe(response => {
            const actionHandler = <FormAction>response;

            switch (actionHandler.key) {
                case FormActionType.Save:
                    this.saveData();
                break;

                case FormActionType.Validate:
                    HelperService.validateForm(this.reactiveForm);
                break;

                case FormActionType.ValidateAndSave:
                    HelperService.validateForm(this.reactiveForm);
                    if (this.reactiveForm.valid)
                        this.saveData();
                break;
            }
        });
    }

    refreshComponent(component: FormComponent<any>) {
        this.storeService.setComponet(component);
    }

    populateReactiveForm(update: boolean, objectId: string = null)  {
        if (this.form.pages != null && this.form.pages.length > 0) {
            // get reactive structure -> formControls, pageGroup and components if it's an update
            const reactiveFormStructure = HelperService.createReactiveFormStructure(this.form, update);
            this.formControls = reactiveFormStructure.formControls;

            // if it's an update, refresh reactive form, set all form controls, validators
            if (update) {
                this.form.pages.forEach(page => {
                    this.reactiveForm.setControl(page.pageId, reactiveFormStructure.pageGroup[page.pageId]);
                });
                this.form = HelperService.updateTemplates(this.form, objectId);
                if (reactiveFormStructure.components != null && reactiveFormStructure.components.length > 0)
                    this.formControls = HelperService.resetValidators(reactiveFormStructure.components,
                                this.formControls, this.componentFactoryResolver);
            } else
                this.reactiveForm = this.formBuilder.group(reactiveFormStructure.pageGroup);
        }
    }
}
