import { OnInit, ViewChild, Component, ViewContainerRef, ComponentFactoryResolver, Input, Renderer2, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormQLMode, HelperService, InternalEventHandlerService, InternalEventHandler, InternalEventType } from '@formql/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    @Input() pathOpenViewMode: string;  // path should contain {0} for passing the fornName

    @ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;
    @ViewChild('rightSidenav', { read: ViewContainerRef }) rightSidenav: ViewContainerRef;
    @ViewChild('editorWindow', { read: ViewContainerRef }) editorWindow: ViewContainerRef;
    @ViewChild('pusher', { read: ViewContainerRef }) pusher: ViewContainerRef;
    @ViewChild('editor', { read: ViewContainerRef }) editor: ViewContainerRef;

    formql: any;
    subscription: any;

    saving = false;
    reactiveForm: FormGroup;

    private componetDestroyed = new Subject();

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef,
        private internalEventHandlerService: InternalEventHandlerService,
        private formBuilder: FormBuilder,
        private renderer: Renderer2

    ) {
        this.loadEventHandlers();
    }

    ngOnInit() {

        this.reactiveForm = this.formBuilder.group([]);

        if (this.ids == null || (this.ids != null && this.ids.length === 0)) {
            this.ids = new Array<string>();
            this.ids.push('0');
        } else {
            if (this.ids.length === 1 && this.ids[0] === undefined)
                this.ids[0] = '0';
        }

        this.formql = this.vcRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, 'FormQLComponent'));
        this.formql.instance.mode = this.mode;
        this.formql.instance.formName = this.formName;
        this.formql.instance.reactiveForm = this.reactiveForm;

        this.target.insert(this.formql.hostView);

    }

    openEditBar() {
        this.renderer.addClass(this.editorWindow.element.nativeElement, 'fql-bar-effect');
        this.renderer.addClass(this.editorWindow.element.nativeElement, 'fql-slide-bar-open');
        this.renderer.addClass(this.pusher.element.nativeElement, 'fql-slide-pusher');
    }

    closeEditBar() {
        this.renderer.removeClass(this.editorWindow.element.nativeElement, 'fql-bar-effect');
        this.renderer.removeClass(this.editorWindow.element.nativeElement, 'fql-slide-bar-open');
        this.renderer.removeClass(this.pusher.element.nativeElement, 'fql-slide-pusher');
    }

    editForm() {
        this.loadEditor('FormEditorComponent', '', InternalEventType.EditingForm);
    }

    openViewMode() {
        let relativePath = this.pathOpenViewMode;
        if (!relativePath)
            relativePath = '/#/form/{0}';

        relativePath = relativePath.replace('{0}', this.formName);

        window.open(window.location.origin + relativePath);

    }

    loadEditor(name: string, object: any, type: InternalEventType) {
        this.editor.clear();

        const component = this.vcRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, name));

        switch (type) {
            case InternalEventType.EditingComponent:
                (<any>component).instance.component = object;
                (<any>component).instance.data = this.formql.instance.data;
                break;

            case InternalEventType.EditingSection:
                (<any>component).instance.section = object;
                break;

            case InternalEventType.EditingPage:
                (<any>component).instance.page = this.formql.instance.form.pages[0];
                break;

            case InternalEventType.EditingForm:
                (<any>component).instance.form = this.formql.instance.form;
                break;

        }

        (<any>component).instance.data = this.formql.instance.data;
        (<any>component).instance.mode = this.mode;

        this.subscription = (<any>component).instance.action
            .pipe(takeUntil(this.componetDestroyed))
            .subscribe(action => { this.editorResponse(action); });

        this.editor.insert(component.hostView);

        this.openEditBar();
    }

    editorResponse($event) {
        this.closeEditBar();
        if ($event)
            if ($event.componentId) {
                this.formql.instance.refreshComponent($event);
                this.formql.instance.populateReactiveForm(true, $event.componentId);
            } else if ($event.sectionId)
                this.formql.instance.populateReactiveForm(true, $event.sectionId);
            else if ($event.pageId)
                this.formql.instance.populateReactiveForm(true, $event.pageId);

        if (this.subscription)
            this.subscription.unsubscribe();

        const self = this;
        setTimeout(function () {
            self.editor.clear();
        }, 500);
    }

    saveForm() {
        this.formql.instance.saveForm();
    }

    saveData() {
        // if (!this.editMode) {
        // 	this.components.forEach(component => {
        // 		if (component != null) {
        // 			if (component.rules == null || (component.rules != null && !component.rules.hidden)) {
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
        if (event === 'saveForm')
            this.saveForm();
        else {
            // this.rightSidenav.open();
            // this.loadDataSourceEditor(event, this.form.dataSource);
        }
    }

    loadEventHandlers() {
        this.internalEventHandlerService.event.pipe(takeUntil(this.componetDestroyed)).subscribe(res => {
            const internalEventHandler = <InternalEventHandler>res;

            switch (internalEventHandler.eventType) {
                case InternalEventType.EditingComponent:
                    this.loadEditor('ComponentEditorComponent', internalEventHandler.event, internalEventHandler.eventType);
                    break;

                case InternalEventType.EditingSection:
                    this.loadEditor('SectionEditorComponent', internalEventHandler.event, internalEventHandler.eventType);
                    break;
                case InternalEventType.EditingPage:
                    this.loadEditor('PageEditorComponent', internalEventHandler.event, internalEventHandler.eventType);
                    break;
            }
        });
    }

    ngOnDestroy(): void {
        this.componetDestroyed.next();
        this.componetDestroyed.unsubscribe();
    }

}
