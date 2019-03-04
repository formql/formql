import { OnInit, OnDestroy, ViewChild, Component, ViewContainerRef, ComponentFactoryResolver, Input, Renderer2 } from "@angular/core";

import { FormGroup, FormBuilder} from "@angular/forms";
import { FormQLMode, HelperService, EventHandlerService, EventHandler, EventType, FormQLComponent} from "@formql/core";


@Component({
	selector: 'formql-editor',
	templateUrl: './formql-editor.component.html',
	styleUrls: ['./formql-editor.component.scss']
})
export class FormQLEditorComponent implements OnInit, OnDestroy {
    @Input() formName: string;
    @Input() ids: Array<string>;
    @Input() mode: FormQLMode = FormQLMode.Edit;
    @Input() validators: Array<Function>;
    
	@ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;
	@ViewChild('rightSidenav', { read: ViewContainerRef }) rightSidenav: ViewContainerRef;
    @ViewChild('editorWindow', { read: ViewContainerRef }) editorWindow: ViewContainerRef;
    @ViewChild('pusher', { read: ViewContainerRef }) pusher: ViewContainerRef;
    @ViewChild('editor', { read: ViewContainerRef }) editor: ViewContainerRef;
    
    formql: any
    
    saving: boolean = false;
    reactiveForm: FormGroup;
    
    constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private vcRef: ViewContainerRef,
		private eventHandlerService: EventHandlerService,
		private formBuilder: FormBuilder,
        private renderer: Renderer2

	) {
		this.loadEventHandlers();
	}

	ngOnInit() {

		this.reactiveForm = this.formBuilder.group([]);
		
		if (this.ids == null || (this.ids != null && this.ids.length == 0)) {
			this.ids = new Array<string>();
			this.ids.push("0");
		}
		else {
			if (this.ids.length == 1 && this.ids[0] == undefined)
				this.ids[0] = "0";
        }
        
        this.formql = this.vcRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, "FormQLComponent"));
        (<any>this.formql).instance.mode = this.mode;
        (<any>this.formql).instance.formName = this.formName;
        (<any>this.formql).instance.reactiveForm = this.reactiveForm;
        
		this.target.insert(this.formql.hostView);

    }
    
    openEditBar() {
        this.renderer.addClass(this.editorWindow.element.nativeElement, "fql-bar-effect");
        this.renderer.addClass(this.editorWindow.element.nativeElement, "fql-slide-bar-open");
        this.renderer.addClass(this.pusher.element.nativeElement, "fql-slide-pusher");
    }

    closeEditBar() {
        this.renderer.removeClass(this.editorWindow.element.nativeElement, "fql-bar-effect");
        this.renderer.removeClass(this.editorWindow.element.nativeElement, "fql-slide-bar-open");
        this.renderer.removeClass(this.pusher.element.nativeElement, "fql-slide-pusher");
    }


	ngOnDestroy() {

    }

    editForm() {
        this.loadEditor('FormEditorComponent', '', EventType.EditingForm);
    }

	loadEditor(name:string, object:any, type:EventType) {
		this.editor.clear();

		let comp = this.vcRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, name));
        
        switch(type)
        {
            case EventType.EditingComponent:
                (<any>comp).instance.component = object;
            break;
            case EventType.EditingSection:
                (<any>comp).instance.section = object;
            break;
            case EventType.EditingPage:
                (<any>comp).instance.page = (<any>this.formql).instance.form.pages[0];
            break;
            case EventType.EditingForm:
                (<any>comp).instance.form = (<any>this.formql).instance.form;
            break;

        }
        
		(<any>comp).instance.data = (<any>this.formql).instance.data;
		(<any>comp).instance.mode = this.mode;

		(<any>comp).instance.action.subscribe(action => {
			this.editorResponse(action);
		});

        this.editor.insert(comp.hostView);
        
        this.openEditBar();
    }
  
	editorResponse($event) {
        this.closeEditBar();
        if ($event) {
            if ($event.componentId)
                (<any>this.formql).instance.populateReactiveForm(true, $event.componentId);
            else if ($event.sectionId)
                (<any>this.formql).instance.populateReactiveForm(true, $event.sectionId);
            else if ($event.pageId)
                (<any>this.formql).instance.populateReactiveForm(true, $event.pageId);
        }

        this.editor.clear();
	}

	saveForm() {
		// this.formStoreService.dispatchSaveFormAction(this.formName, this.form);
	}

	saveData() {
		// if (!this.editMode) {
		// 	this.components.forEach(component => {
		// 		if (component != null) {
		// 			if (component.properties == null || (component.properties != null && !component.properties.hidden)) {
		// 				let componentControl = this.formControls.find(fc => fc.key == component.componentId);
		// 				componentControl.control.markAsTouched({ onlySelf: true });
		// 			}
		// 		}
		// 	});

        //     //if (this.reactiveForm.valid)
        //         this.formStoreService.dispatchSaveDataAction(this.form.dataSource.mutation, this.ids, this.data );
		// 	//else
		// 	//	alert('form not valid');
		// }
	}

	leftSideNavBarActionClick(event) {
        if (event === "saveForm")
            this.saveForm();
        else
        {
            //this.rightSidenav.open();
            // this.loadDataSourceEditor(event, this.form.dataSource);
        }
    }

	loadEventHandlers() {
		this.eventHandlerService.event.subscribe(res => {
			let eventHandler = <EventHandler>res;

			switch (eventHandler.eventType) {
				case EventType.EditingComponent:
					this.loadEditor("ComponentEditorComponent", eventHandler.event, eventHandler.eventType);
					break;

				case EventType.EditingSection:
					this.loadEditor("SectionEditorComponent", eventHandler.event, eventHandler.eventType);
                    break;
                case EventType.EditingPage:
					this.loadEditor("PageEditorComponent", eventHandler.event, eventHandler.eventType);
                        break;
			}
		});
	}

	
}