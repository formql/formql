import { OnDestroy, ViewChild, Component, ViewContainerRef, ComponentFactoryResolver, Input, AfterViewInit, AfterViewChecked, OnInit } from "@angular/core";
import { FormWrapper, FormError } from "../models/form-wrapper.model";
import { InternalEventHandlerService } from "../services/internal-event-handler.service";
import { InternalEventHandler, InternalEventType } from "../models/internal-event-handler.model";
import { HelperService } from "../services/helper.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { FormComponent, ComponentControl } from "../models/form-component.model";
import { FormQLMode } from "../models/formql-mode.model";
import { Page } from "../models/page.model";
import { Section } from "../models/section.model";
import { StoreService } from "../services/store.service";

@Component({
    selector: 'formql',
    styleUrls: ["./formql.component.scss"], 
    template: `<div *ngIf="error" class="fql-error-message">
                    <h4>{{error?.title}}</h4>
                    <span>{{error?.message}}</span>
               </div>
               <ng-container #target></ng-container>`
})
export class FormQLComponent implements OnDestroy, OnInit {
    static componentName = "FormQLComponent";

    @Input() formName: string;
    @Input() ids: Array<string>;
    @Input() mode: FormQLMode = FormQLMode.View;
    @Input() validators: Array<Function>;
    @Input() reactiveForm: FormGroup;
    @Input() customMetadata: any;

	@ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;

    loading: boolean = true;
    saving: boolean = false;
    
    form: FormWrapper;
    formControls: ComponentControl[];
    data: any;

    error: FormError;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef,
        private eventHandlerService: InternalEventHandlerService,
        private formBuilder: FormBuilder,
        private storeService: StoreService
    ) {
    }

    ngOnInit() {
        if (!this.reactiveForm)
            this.reactiveForm = this.formBuilder.group([]);

        this.loadEventHandlers();

        if (this.ids == null || (this.ids != null && this.ids.length == 0)) {
            this.ids = new Array<string>();
            this.ids.push("0");
        }
        else {
            if (this.ids.length == 1 && this.ids[0] == undefined)
                this.ids[0] = "0";
        }

        this.storeService.getForm().subscribe(form => {
            if (form && !form.error) {
                this.formControls = Array<ComponentControl>();
                this.form = form;

                this.storeService.getComponents().subscribe(components => {
                    if (this.loading)
                        this.populateReactiveForm(false);
                    
                    if (components && components.length > 0) {
                        components.forEach(component => {
                            if (component != null) {
                                const componentControl = this.formControls.find(fc => fc.key == component.componentId);
                                HelperService.setValidators(this.componentFactoryResolver, component, componentControl.control);
                            }
                        });
                    }
                    
                    if (this.loading)                       
                        this.loadForm();
                });
                
                this.storeService.getData().subscribe(data => this.data = data);
            }
            else
                this.error = {...form.error};
        });
        this.storeService.getAll(this.formName, this.ids);
    }

    ngOnDestroy() {
        if (!this.eventHandlerService.event) 
            this.eventHandlerService.event.unsubscribe();
        
        if (this.storeService.getForm().subscribe)
            this.storeService.getForm().subscribe().unsubscribe();

        if (this.storeService.getComponents().subscribe)
            this.storeService.getComponents().subscribe().unsubscribe();
    }

    loadForm() {
        if (this.target)
            this.target.clear();

        this.loading = false;        
        const component = this.vcRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, this.form.layoutComponentName));
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
        if (this.mode != FormQLMode.Edit) {
            this.storeService.saveData();
            // this.components.forEach(component => {
            //     if (component != null) {
            //         if (component.properties == null || (component.properties != null && !component.properties.hidden)) {
            //             let componentControl = this.formControls.find(fc => fc.key == component.componentId);
            //             componentControl.control.markAsTouched({ onlySelf: true });
            //         }
            //     }
            // });

            //if (this.reactiveForm.valid)
            //this.formStoreService.dispatchSaveDataAction(this.form.dataSource.mutation, this.ids, this.data);
            //else
            //	alert('form not valid');
        }
    }

    loadEventHandlers() {
        this.eventHandlerService.event.subscribe(res => {
            let eventHandler = <InternalEventHandler>res;

            switch (eventHandler.eventType) {
                case InternalEventType.DndFormChanged:
                    let pageId = (<Page>res.event).pageId;
                    let index = this.form.pages.findIndex(p=>p.pageId === pageId);
                    
                    if (index >= 0)
                        this.form.pages[index] = res.event;
                    
                    this.populateReactiveForm(true, pageId);
                break;

                case InternalEventType.RemoveComponent:
                    let componentId = (<FormComponent<any>>res.event).componentId;
                    let updateSectionId = "";
                    this.form.pages.forEach(page => {
                        page.sections.forEach(section => {
                            let index = section.components.findIndex(c=>c.componentId == componentId);
                            if (index >= 0)
                            {
                                section.components.splice(index, 1);
                                updateSectionId = section.sectionId; 
                            }
                        });
                    });
                    this.populateReactiveForm(true, updateSectionId);
                break;

                case InternalEventType.RemoveSection:
                    let sectionId = (<Section>res.event).sectionId;
                    let updatePageId = "";
                    this.form.pages.forEach(page => {
                        let index = page.sections.findIndex(c=>c.sectionId == sectionId);
                        if (index >= 0)
                        {
                            page.sections.splice(index, 1);
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

    populateReactiveForm(update:boolean, objectId:string = null)  {
        if (this.form.pages != null) {
            const pageGroup: any = {};
            this.form.pages.forEach(page => {
                let sectionGroup: any = {};
                if (page.sections != null) {
                    page.sections.forEach(section => {
                        let componentGroup: any = {};
                        if (section.components != null) {
                            section.components.forEach(component => {
                                let singleComponentGroup: any = {};
                                singleComponentGroup[component.componentId] = new FormControl();
                                this.formControls.push(<ComponentControl>{
                                    key: component.componentId,
                                    control: singleComponentGroup[component.componentId]
                                });
                                componentGroup[component.componentId] = new FormGroup(singleComponentGroup);
                            });
                        }
                        sectionGroup[section.sectionId] = new FormGroup(componentGroup);
                    });
                }
                pageGroup[page.pageId] = new FormGroup(sectionGroup);
            });
            
            if (update)
            {
                this.form.pages.forEach(page => {
                    this.reactiveForm.setControl(page.pageId, pageGroup[page.pageId]);
                });
                this.updateTemplates(objectId);
            }
            else
                this.reactiveForm = this.formBuilder.group(pageGroup);
        }
        
    }

    updateTemplates(objectId:string = null) {
        this.form.pages.forEach(page => {
            if (page.template.reRender || (objectId && (page.pageId == objectId || page.sections.find(c=>c.sectionId==objectId))))
            {
                page.template.reRender = false;
                page.template = HelperService.deepCopy(page.template);
            }
            page.sections.forEach(section => {
                if (section.template.reRender || (objectId && (section.sectionId == objectId || section.components.find(c=>c.componentId==objectId))))
                {
                    section.template.reRender = false;
                    section.template = HelperService.deepCopy(section.template);
                }
            });
            
        });
    }
}