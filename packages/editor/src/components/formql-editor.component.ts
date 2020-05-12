import { Component, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ComponentResolverService,
  FormQLComponent,
  FormQLMode,
  InternalEventHandler,
  InternalEventHandlerService,
  InternalEventType
} from '@formql/core';
import { Subject, Subscription } from 'rxjs';
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
  @Input() pathOpenViewMode: string; // path should contain {0} for passing the fornName

  @ViewChild('target', { read: ViewContainerRef, static: true }) target: ViewContainerRef;
  @ViewChild('rightSidenav', { read: ViewContainerRef, static: true }) rightSidenav: ViewContainerRef;
  @ViewChild('editorWindow', { read: ViewContainerRef, static: true }) editorWindow: ViewContainerRef;
  @ViewChild('pusher', { read: ViewContainerRef, static: true }) pusher: ViewContainerRef;
  @ViewChild('editor', { read: ViewContainerRef, static: true }) editor: ViewContainerRef;

  formql: FormQLComponent;
  subscription$: Subscription;

  saving = false;
  reactiveForm: FormGroup;

  private componetDestroyed = new Subject();

  constructor(
    private componentResolverService: ComponentResolverService,
    private vcRef: ViewContainerRef,
    private internalEventHandlerService: InternalEventHandlerService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2
  ) {
    this.loadEventHandlers();
  }

  ngOnInit() {
    this.reactiveForm = this.formBuilder.group([]);

    const formQLRef = this.vcRef.createComponent(this.componentResolverService.resolveComponent('FormQLComponent'));
    const formql = <any>formQLRef;

    formql.instance.mode = this.mode;
    formql.instance.formName = this.formName;
    formql.instance.ids = this.ids;
    formql.instance.reactiveForm = this.reactiveForm;

    this.target.insert(formql.hostView);

    this.formql = <FormQLComponent>formql.instance;
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
    if (!relativePath) relativePath = '/#/form/{0}';

    if (this.ids && this.ids.length > 0) relativePath = `${relativePath.replace('{0}', this.formName)}/${this.ids[0]}`;
    else relativePath = `${relativePath.replace('{0}', this.formName)}`;

    window.open(window.location.origin + relativePath);
  }

  loadEditor(name: string, object: any, type: InternalEventType) {
    this.editor.clear();

    const componentRef = this.vcRef.createComponent(this.componentResolverService.resolveComponent(name));
    const component = <any>componentRef;

    switch (type) {
      case InternalEventType.EditingComponent:
        component.instance.component = object;
        component.instance.data = this.formql.data;
        break;

      case InternalEventType.EditingSection:
        component.instance.section = object;
        break;

      case InternalEventType.EditingPage:
        component.instance.page = this.formql.form.pages[0];
        break;

      case InternalEventType.EditingForm:
        component.instance.form = this.formql.form;
        break;
    }

    component.instance.data = this.formql.data;
    component.instance.mode = this.mode;

    this.subscription$ = component.instance.action.pipe(takeUntil(this.componetDestroyed)).subscribe((action) => {
      this.editorResponse(action);
    });

    this.editor.insert(component.hostView);

    this.openEditBar();
  }

  editorResponse($event) {
    this.closeEditBar();
    if ($event)
      if ($event.componentId) {
        this.formql.refreshComponent($event);
        this.formql.resetForm($event.componentId);
      } else if ($event.sectionId) this.formql.resetForm($event.sectionId);
      else if ($event.pageId) this.formql.resetForm($event.pageId);

    if (this.subscription$) this.subscription$.unsubscribe();

    const self = this;
    setTimeout(function () {
      self.editor.clear();
    }, 500);
  }

  saveForm() {
    this.formql.saveForm();
  }

  leftSideNavBarActionClick(event) {
    if (event === 'saveForm') this.saveForm();
  }

  loadEventHandlers() {
    this.internalEventHandlerService.event.pipe(takeUntil(this.componetDestroyed)).subscribe((res) => {
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
