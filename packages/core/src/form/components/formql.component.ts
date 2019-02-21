import { OnInit, OnDestroy, ViewChild, Component, ViewContainerRef, ComponentFactoryResolver, Type, ViewEncapsulation, ElementRef, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { FormWrapper } from "../models/form-wrapper.model";
import { EventHandlerService } from "../services/event-handler.service";
import { EventHandler, EventType } from "../models/event-handler.model";
import { FormStoreService } from "../store/form-store.service";
import { HelperService } from "../services/helper.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { FormComponent, ComponentControl } from "../models/form-component.model";
import { FormQLMode } from "../models/formql-mode.model";
import { Observable } from "rxjs";
import { Section } from "../models/section.model";
import { Page } from "../models/page.model";

@Component({
    selector: 'formql',
    template: `<span #target></span>`,
    styleUrls: ['./formql.component.scss']
})
export class FormQLComponent implements OnInit, OnDestroy {
    static componentName = "FormQLComponent";

    @Input() formName: string;
    @Input() ids: Array<string>;
    @Input() mode: FormQLMode = FormQLMode.View;
    @Input() validators: Array<Function>;
    @Input() reactiveForm: FormGroup;

    @Output() editorEvent = new EventEmitter();

	@ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;

    loading: boolean = true;
    saving: boolean = false;
    step: number;
    
    form: FormWrapper;
    data: any;
    
    components: FormComponent<any>[];
    formControls: ComponentControl[];

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef,
        private eventHandlerService: EventHandlerService,
        private formStoreService: FormStoreService,
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef
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

        this.formStoreService.dispatchLoadAction(this.formName, this.ids);

        this.formStoreService.getForm().subscribe(form => {
            if (form != null) {
                this.formControls = Array<ComponentControl>();
                this.form = form;

                this.populateReactiveForm(false);
                    this.formStoreService.getComponents().subscribe(components => {
                        if (components) {
                            this.components = components;
                            this.components.forEach(component => {
                                if (component != null) {
                                    let componentControl = this.formControls.find(fc => fc.key == component.componentId);
                                    HelperService.setValidators(this.componentFactoryResolver, component, componentControl.control);
                                }
                            });
                        }
                    });

                    if (this.mode != FormQLMode.Edit) {
                        this.formStoreService.getData().subscribe(data => {

                            if (data != null) {
                                this.data = data;

                                if (this.loading)
                                    this.loadForm();
                            }
                        });
                    }
                    else {
                        if (this.loading)
                            this.loadForm();
                    }
            }
        });
    }

    ngOnDestroy() {

    }

    loadForm() {
        this.loading = false;

        let comp = this.vcRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, this.form.layoutComponentName));
        (<any>comp).instance.form = this.form;
        (<any>comp).instance.reactiveForm = this.reactiveForm;
        (<any>comp).instance.mode = this.mode;
        

        this.target.insert(comp.hostView);

    }

    saveForm() {
        this.formStoreService.dispatchSaveFormAction(this.formName, this.form);
    }

    saveData() {
        if (this.mode != FormQLMode.Edit) {
            this.components.forEach(component => {
                if (component != null) {
                    if (component.properties == null || (component.properties != null && !component.properties.hidden)) {
                        let componentControl = this.formControls.find(fc => fc.key == component.componentId);
                        componentControl.control.markAsTouched({ onlySelf: true });
                    }
                }
            });

            //if (this.reactiveForm.valid)
            this.formStoreService.dispatchSaveDataAction(this.form.dataSource.mutation, this.ids, this.data);
            //else
            //	alert('form not valid');
        }
    }

    setStep(index: number) {
        this.step = index;
    }

    loadEventHandlers() {
        this.eventHandlerService.event.subscribe(res => {
            let eventHandler = <EventHandler>res;

            switch (eventHandler.eventType) {
                case EventType.EditingComponent:
                    this.editorEvent.emit({ name: "FormComponentEditorComponent", event: eventHandler.event});
                    //this.loadEditor("FormComponentEditorComponent", );
                    //this.rightSidenav.open();
                    break;

                case EventType.EditingSection:
                    this.editorEvent.emit({ name: "FormComponentEditorComponent", event: eventHandler.event});
                    //this.loadEditor("FormSectionEditorComponent", eventHandler.event);
                    //this.rightSidenav.open();
                    break;

                case EventType.DndFormChanged:
                    let index = this.form.pages.findIndex(p=>p.pageId === (<Page>res.event).pageId);
                    
                    if (index >= 0)
                        this.form.pages[index] = res.event;
                    
                    this.populateReactiveForm(true);
                    //this.formStoreService.dispatchUpdateFormAction(this.form);
                    break;

                case EventType.SaveData:
                    this.saveData();
                    break;

            }
        });
    }

    populateReactiveForm(update)  {
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
                this.updateTemplates();
            }
            else
                this.reactiveForm = this.formBuilder.group(pageGroup);
        }
        
    }

    updateTemplates() {
        this.form.pages.forEach(page => {
            page.sections.forEach(section => {
                if (section.template.reRender)
                {
                    section.template.reRender = false;
                    section.template = HelperService.deepCopy(section.template);
                }
            });
            if (page.template.reRender)
            {
                page.template.reRender = false;
                page.template = HelperService.deepCopy(page.template);
            }
        });
    }
}