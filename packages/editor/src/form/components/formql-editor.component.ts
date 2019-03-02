import { OnInit, OnDestroy, ViewChild, Component, ViewContainerRef, ComponentFactoryResolver, Input, Renderer2 } from "@angular/core";

//import { FormQLComponent, FormQLMode } from "@formql/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
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

	loading: boolean = true;
	saving: boolean = false;
    reactiveForm: FormGroup;
    
    constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private vcRef: ViewContainerRef,
		private eventHandlerService: EventHandlerService,
		private route: ActivatedRoute,
		private sanitizer: DomSanitizer,
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

	loadForm() {
		this.loading = false;

		
	}

	loadEditor(name:string, object:any, type:EventType) {
		this.editor.clear();

		let comp = this.vcRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, name));
        if (type == EventType.EditingComponent)
            (<any>comp).instance.component = object;
        else if (type == EventType.EditingSection)
            (<any>comp).instance.section = object;

		(<any>comp).instance.data = (<any>this.formql).instance.data;
		(<any>comp).instance.mode = this.mode;

		(<any>comp).instance.action.subscribe(action => {
			this.editorResponse(action);
		});

        this.editor.insert(comp.hostView);
        
        this.openEditBar();
	}


	loadDataSourceEditor(componentName, dataSource) {
		// this.editor.clear();

		// let comp = this.vcRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, componentName));
		// (<any>comp).instance.dataSource = dataSource;
		// //(<any>comp).instance.data = this.data;
		// //(<any>comp).instance.class = this.form.class;
		// (<any>comp).instance.liveEdit = this.liveEditMode;

		// (<any>comp).instance.action.subscribe(action => {
		// 	this.editorResponse(action);
		// });

		// this.editor.insert(comp.hostView);
	}

	editorResponse($event) {
        this.closeEditBar();
        if ($event) {
            if ($event.componentId)
                (<any>this.formql).instance.populateReactiveForm(true, $event.componentId);
            else if ($event.sectionId)
                (<any>this.formql).instance.populateReactiveForm(true, $event.sectionId);
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

	rightSideNavBarActionClick(event) {
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
			}
		});
	}

	
}