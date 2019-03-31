import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormRule, FormValidator, FormComponent, FormQLMode, HelperService, FormRules } from '@formql/core';

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

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        this.componentList = Array.from(this.componentFactoryResolver['_factories'].keys())
            .filter((x: any) => x.formQLComponent)
            .map((x: any) => x.componentName)
            .filter((x, index, self) => index === self.indexOf(x))
            .sort();
    }

    ngOnInit() {
        this.updatedComponent = <FormComponent<any>>{};
        this.updatedComponent = HelperService.deepCopy(this.component, ['value']);
        this.loadValidators();
    }

    save() {
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

    loadValidators() {
        this.validators = Array<FormValidator>();
        this.validators.push(<FormValidator>{ name: 'Calculated Field', key: 'value', validator: null });
        this.validators.push(<FormValidator>{ name: 'Hidden Condition', key: 'hidden', validator: null });
        this.validators.push(<FormValidator>{ name: 'Read Only Condition', key: 'readonly', validator: null });

        const factories = Array.from(this.componentFactoryResolver['_factories'].keys());
        const type = factories.find((x: any) => x.componentName === this.component.componentName);

        if (type != null && type['validators'] !== null)
            type['validators'].forEach((v: FormValidator) => {
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
    }
}