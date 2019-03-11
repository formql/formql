import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild, Renderer2, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormComponent } from '../models/form-component.model';
import { EventHandlerService } from '../services/event-handler.service';
import { EventType } from '../models/event-handler.model';
import { HelperService } from '../services/helper.service';
import { FormGroup } from '@angular/forms';
import { FormQLMode } from '../models/formql-mode.model';
import { WrapperType } from '../models/wrapper-type.model';
import { StoreService } from '../services/store.service';


@Component({
    selector: '[componentContainer]',
    template: `
    <div #wrapper dnd 
        [sourceObjectId]="component.componentId"
        [attr.componentId]="component.componentId"
        [sourceWrapperId]="sectionId" 
        [type]="WrapperType.Component" 
        [mode]="mode"
        [ngClass]="{'fql-component-container-wrapper': (mode == FormQLMode.Edit || mode == FormQLMode.LiveEdit)}">
        <div class="fql-component-vilibility-off"></div>
        <div class="fql-component-tooltip">
            <ng-container #tooltip></ng-container>
        </div>
        <div class="fql-component-container">
            <ng-container #content></ng-container>
        </div>
    </div>`,
    styleUrls: ['./component-container.component.scss']

})
export class ComponentContainerComponent implements OnInit {

    @ViewChild('content', { read: ViewContainerRef }) content: ViewContainerRef;
    @ViewChild('wrapper', { read: ViewContainerRef }) wrapper: ViewContainerRef;
    @ViewChild('tooltip', { read: ViewContainerRef }) tooltip: ViewContainerRef;

    private _value: any;

    @Input() component: FormComponent<any>;
    @Input() reactiveSection: FormGroup;
    @Input() sectionId: string;
    @Input('value') 
    set value(value: any) {
        this._value = value;
        if (this.reactiveSection && this.component) {
            let control = this.reactiveSection.controls[this.component.componentId].get(this.component.componentId);
            control.setValue(this.component.value);
        }
    }
    get value() {
        return this._value;
    }
    @Input() mode: FormQLMode;

    public FormQLMode = FormQLMode;
    public WrapperType = WrapperType;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private eventHandlerService: EventHandlerService,
        private storeService: StoreService
    ) {}

    ngOnInit() {
        const component = this.viewContainerRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, this.component.componentName));
        (<any>component).instance.field = this.component;
        (<any>component).instance.reactiveFormGroup = this.reactiveSection.controls[this.component.componentId];
        if (this.component.tabIndex != null)
            (<any>component).instance.tabIndex = this.component.tabIndex;
        this.content.insert(component.hostView);

        this.reactiveSection.controls[this.component.componentId].valueChanges.subscribe((change) => {
            if (this.component.value != change[this.component.componentId]) {
                this.component.value = change[this.component.componentId];
                this.storeService.setComponet(this.component);
            }
        });

        if (this.mode == FormQLMode.Edit || this.mode == FormQLMode.LiveEdit)
        {
            const tooltip = this.viewContainerRef.createComponent(HelperService.getFactory(this.componentFactoryResolver, "TooltipComponent"));
            (<any>tooltip).instance.wrapper = this.wrapper;
            (<any>tooltip).instance.type = WrapperType.Component;
            (<any>tooltip).instance.object = this.component;
            this.tooltip.insert(tooltip.hostView);
        }
    }

    editField() {
        if (this.mode == FormQLMode.Edit || this.mode == FormQLMode.LiveEdit)
            this.eventHandlerService.send(EventType.EditingComponent, this.component);
    }
}
