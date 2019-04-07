import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, DoCheck } from '@angular/core';
import { FormRule, FormValidator, FormComponent, FormQLMode, HelperService, FormRules, FormAction, FormActionType } from '@formql/core';

@Component({
    selector: 'formql-component-editor',
    templateUrl: './component-editor.component.html',
    styleUrls: ['./component-editor.component.scss']
})
export class ComponentEditorComponent implements OnInit {
    static componentName = 'ComponentEditorComponent';

    @Input() component: FormComponent<any>;
    @Input() data: any;
    @Input() mode: FormQLMode;
    @Output() action = new EventEmitter<any>();

    updatedComponent: FormComponent<any>;
    disableSaveButton = false;
    componentList: Array<any>;
    validators: Array<FormValidator>;
    rules: Array<FormRule>;
    actionList: Array<FormAction>;
    factories: any;

    FormActionType = FormActionType;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        this.factories = Array.from(this.componentFactoryResolver['_factories'].keys());
        this.componentList = this.factories
            .filter((x: any) => x.formQLComponent)
            .map((x: any) => x.componentName)
            .filter((x, index, self) => index === self.indexOf(x))
            .sort();
    }

    ngOnInit() {
        this.updatedComponent = <FormComponent<any>>{};
        this.updatedComponent = HelperService.deepCopy(this.component, ['value']);
        this.loadValidators(this.component.componentName);
        this.loadActions(this.component.componentName);
    }

    save() {
        if (this.updatedComponent.action && !this.updatedComponent.action.key)
            this.updatedComponent.action = null;
        else
            if (this.updatedComponent.action && this.updatedComponent.action.key !== FormActionType.Custom) {
                this.updatedComponent.action.customkey = null;
                this.updatedComponent.action.parameters = null;
            }

        this.component = HelperService.propertyCopy(this.updatedComponent, this.component, ['value']);
        this.action.emit(this.component);
    }

    getEvaluatedValue(condition) {
        const response = HelperService.evaluateValue(condition, this.data);
        return response.value;
    }

    getEvaluatedCondition(condition) {
        const response = HelperService.evaluateCondition(condition, this.data);
        return response.value;
    }

    getError(condition) {
        const response = HelperService.evaluateCondition(condition, this.data);
        return response.error;
    }

    actionTriggered($event) {
        if ($event)
            this.save();
        else
            this.action.emit();
    }

    cancel() {
        this.action.emit();
    }

    componentChanged() {
        this.loadValidators(this.updatedComponent.componentName, true);
        this.loadActions(this.updatedComponent.componentName, true);
    }

    loadValidators(componentName: string, reset = false) {
        this.validators = Array<FormValidator>();
        this.validators.push(<FormValidator>{ name: 'Calculated Field', key: 'value', validator: null });
        this.validators.push(<FormValidator>{ name: 'Hidden Condition', key: 'hidden', validator: null });
        this.validators.push(<FormValidator>{ name: 'Read Only Condition', key: 'readonly', validator: null });

        const componentRef = this.factories.find((x: any) => x.componentName === componentName);

        if (componentRef != null && componentRef['validators'] !== null)
            componentRef['validators'].forEach((v: FormValidator) => {
                this.validators.push(v);
            });

        this.rules = Array<FormRule>();

        this.validators.forEach(v => {
            if (!this.updatedComponent.rules)
                this.updatedComponent.rules = <FormRules>{};

            const item = this.updatedComponent.rules[v.key];
            if (item === undefined) {
                this.updatedComponent.rules[v.key] = <FormRule>{ key: v.key, condition: '' };
                this.rules.push(this.updatedComponent.rules[v.key]);
            } else
                this.rules.push(item);
        });

        if (reset)
            this.updatedComponent.rules = HelperService.deepCopy(this.component.rules);
    }

    loadActions(componentName: string, reset = false) {
        const componentRef = this.factories.find((x: any) => x.componentName === componentName);
        if (componentRef['actions'] && componentRef['actions'].length > 0) {
            if (!this.updatedComponent.action)
                this.updatedComponent.action = <FormAction>{};

            this.actionList = Array<FormAction>();
            this.actionList.push(<FormAction>{});
            this.actionList = this.actionList.concat(<Array<FormAction>>componentRef['actions']);
            this.actionList.sort((left, right) => {
                if (left.key < right.key)
                    return -1;
                if (left.key > right.key)
                    return 1;
                return 0;
            });
        } else
            this.actionList = null;

        if (reset)
            this.updatedComponent.action = HelperService.deepCopy(this.component.action);
    }
}
