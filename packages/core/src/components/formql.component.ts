import { OnDestroy, ViewChild, Component, ViewContainerRef, ComponentFactoryResolver, Input,  OnInit } from '@angular/core';
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
import { Observable } from 'rxjs';

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
    @Input() validators: Array<Function>;
    @Input() reactiveForm: FormGroup;
    @Input() customMetadata: any;

    @ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;

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
        private formBuilder: FormBuilder,
        private storeService: StoreService
    ) {
    }

    ngOnInit() {
        if (!this.reactiveForm)
            this.reactiveForm = this.formBuilder.group([]);

        if (this.mode === FormQLMode.Edit)
            this.loadInternalEventHandlers();

        this.form$ = this.storeService.getForm();
        this.components$ = this.storeService.getComponents();
        this.data$ = this.storeService.getData();

        this.form$.subscribe(form => {
            if (form && !form.error) {
                this.form = form;

                this.components$.subscribe(components => {
                    if (this.loading)
                        this.populateReactiveForm(false);

                    if (components && components.length > 0)
                        components.forEach(component => {
                            if (component != null) {
                                const componentControl = this.formControls.find(fc => fc.key === component.componentId);
                                component = HelperService.setValidators(this.componentFactoryResolver, component, componentControl.control);
                            }
                        });

                    if (this.loading)
                        this.loadForm();
                });
                this.data$.subscribe(data => this.data = data);
            } else
                this.error = {...form.error};
        });
        this.storeService.getAll(this.formName, this.ids);
    }

    ngOnDestroy() {
        if (this.internalEventHandlerService && this.internalEventHandlerService.event)
            this.internalEventHandlerService.event.unsubscribe();

        if (this.form$.subscribe)
            this.form$.subscribe().unsubscribe();

        if (this.components$.subscribe)
            this.components$.subscribe().unsubscribe();

        if (this.data$.subscribe)
            this.data$.subscribe().unsubscribe();

        this.storeService.completeAll();
    }

    loadForm() {
        if (this.target)
            this.target.clear();

        this.loading = false;
        const component = this.vcRef.createComponent(
            HelperService.getFactory(this.componentFactoryResolver, this.form.layoutComponentName));
        (<any>component).instance.form = this.form;
        (<any>component).instance.reactiveForm = this.reactiveForm;
        (<any>component).instance.mode = this.mode;
        component.changeDetectorRef.detectChanges();

        this.target.insert(component.hostView);
    }

    saveForm() {
        this.storeService.saveForm(this.formName, this.form);
    }

    saveData() {
        if (this.mode !== FormQLMode.Edit)
            this.storeService.saveData();
            // this.components.forEach(component => {
            //     if (component != null) {
            //         if (component.rules == null || (component.rules != null && !component.rules.hidden)) {
            //             let componentControl = this.formControls.find(fc => fc.key == component.componentId);
            //             componentControl.control.markAsTouched({ onlySelf: true });
            //         }
            //     }
            // });

            // if (this.reactiveForm.valid)
            // this.formStoreService.dispatchSaveDataAction(this.form.dataSource.mutation, this.ids, this.data);
            // else
            // alert('form not valid');
    }

    loadInternalEventHandlers() {
        this.internalEventHandlerService.event.subscribe(res => {
            const eventHandler = <InternalEventHandler>res;

            switch (eventHandler.eventType) {
                case InternalEventType.DndFormChanged:
                    const pageId = (<FormPage>res.event).pageId;
                    const indexDnd = this.form.pages.findIndex(p => p.pageId === pageId);

                    if (indexDnd >= 0)
                        this.form.pages[indexDnd] = res.event;

                    this.populateReactiveForm(true, pageId);
                break;

                case InternalEventType.RemoveComponent:
                    const componentId = (<FormComponent<any>>res.event).componentId;
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
                    const sectionId = (<FormSection>res.event).sectionId;
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

    refreshComponent(component: FormComponent<any>) {
        this.storeService.setComponet(component);
    }

    populateReactiveForm(update: boolean, objectId: string = null)  {
        if (this.form.pages != null && this.form.pages.length > 0) {
            // get reactive structure -> formControls, pageGroup and components if it's an update
            const reactiveStructure = HelperService.createReactiveFormStructure(this.form, update);
            this.formControls = reactiveStructure.formControls;

            // if it's an update, refresh reactive form, set all form controls, validators 
            if (update) {
                this.form.pages.forEach(page => {
                    this.reactiveForm.setControl(page.pageId, reactiveStructure.pageGroup[page.pageId]);
                });
                this.form = this.updateTemplates(this.form, objectId);
                if (reactiveStructure.components != null && reactiveStructure.components.length > 0)
                    reactiveStructure.components.forEach(component => {
                        if (component != null) {
                            const componentControl = this.formControls.find(fc => fc.key === component.componentId);
                            component = HelperService.setValidators(this.componentFactoryResolver, component, componentControl.control);
                        }
                    });
            } else
                this.reactiveForm = this.formBuilder.group(reactiveStructure.pageGroup);
        }
    }

    updateTemplates(form: FormWindow, objectId: string = null) {
        form.pages.forEach(page => {
            if (page.template.reRender ||
                (objectId && (page.pageId === objectId || page.sections.find(c => c.sectionId === objectId)))) {
                page.template.reRender = false;
                page.template = HelperService.deepCopy(page.template);
            }
            page.sections.forEach(section => {
                if (section.template.reRender ||
                    (objectId && (section.sectionId === objectId || section.components.find(c => c.componentId === objectId)))) {
                    section.template.reRender = false;
                    section.template = HelperService.deepCopy(section.template);
                }
            });
        });
        return form;
    }
}
