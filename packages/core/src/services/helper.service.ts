import { Injectable, Component, Type, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormComponent, ComponentControl } from '../models/form-component.model';
import { FormError, FormWindow } from '../models/form-window.model';
import { EvalResponse } from '../models/type.model';
import { FormValidator } from '../models/rule.model';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    public static evaluateCondition(condition: string, data: any): EvalResponse {
        'use strict';
        let response = <EvalResponse>{ value: false, error: null };

        if (condition && condition.trim() !== '' && condition !== 'false') {

            if (condition === 'true') {
                response.value = true;
                return response;
            }

            if (!data)
                return response;

            response = {...this.evaluate(condition, data)};

            if (response.value !== true)
                response.value = false;
        }
        return response;
    }

    public static evaluateValue(path: string, data: any): EvalResponse {
        'use strict';

        let response = <EvalResponse>{ value: null, error: null };

        if (!data)
            return response;

        response = {...this.evaluate(path, data)};

        if (Number.isNaN(response.value) || response.value === Infinity)
            response.value = null;
        else
            response.value = this.deepCopy(response.value);

        return response;
    }

    private static evaluate(path: string, data: any): EvalResponse {
        'use strict';

        const response = <EvalResponse>{ value: null, error: null };

        const props = Object.keys(data);
        const params = [];

        for (let i = 0; i < props.length; i++)
            params.push(data[props[i]]);

        params.push(path);

        props.push('path');

        const expression = `
            'use strict'
            let window = undefined;
            let document = undefined;
            let alert = undefined;
            let a = undefined;
            return ${path};
        `;

        props.push(expression);

        try {
            const evalFunc = new Function(...props);
            response.value = evalFunc(...params);
        } catch (err) {
            response.error = err;
        }
        return response;
    }

    public static resolveType(value, type) {
        if (value === null || value === undefined || value === '')
            return null;
        else if (Number.isNaN(value))
            return 0;

        switch (type) {
            case 'number':
                if (typeof value === 'string')
                    value = value.replace(/[^\d\.]/g, '');

                return Number(value);

            default:
                return value;
        }
    }

    public static getFactory(componentFactoryResolver: ComponentFactoryResolver, componentName: string): ComponentFactory<Component> {
        const factories = Array.from(componentFactoryResolver['_factories'].keys());
        const type = <Type<Component>>factories.find((x: any) => x.componentName === componentName);

        return componentFactoryResolver.resolveComponentFactory(type);
    }

    public static setValidators(componentFactoryResolver: ComponentFactoryResolver,
                                component: FormComponent<any>, control: FormControl): FormControl {
        const factories = Array.from(componentFactoryResolver['_factories'].keys());
        const type = factories.find((x: any) => x.componentName === component.componentName);
        if (type && (!type['validators'] || (type['validators'] && type['validators'].length === 0)))
            return control;

        const validators = [];
        if (component.rules != null) {
            const FormValidators = <Array<FormValidator>>type['validators'];
            Object.keys(component.rules).forEach(key => {
                const item = component.rules[key];
                if (item.value && item.key !== 'readonly' && item.key !== 'hidden' && item.key !== 'value') {
                    const validator = FormValidators.find(x => x.key === item.key);
                    if (validator && validator.validator)
                        validators.push(validator.validator);
                } else if (item.value && item.key === 'readonly' && control.enabled)
                    control.disable();
            });
            if (control.disabled &&
                (!component.rules || (component.rules && !component.rules.readonly) ||
                (component.rules && component.rules.readonly && !component.rules.readonly.value)))
                control.enable();
        }
        if (validators.length > 0)
            control.setValidators(validators);

        return control;
    }

    public static createReactiveFormStructure(form: FormWindow, getComponents: boolean = false) {
        const formControls = Array<ComponentControl>();
        const components = Array<FormComponent<any>>();
        const pageGroup = new FormGroup({});
        form.pages.forEach(page => {
            const sectionGroup: any = {};
            if (page.sections != null)
                page.sections.forEach(section => {
                    const componentGroup: any = {};
                    if (section.components != null)
                        section.components.forEach(component => {
                            if (getComponents)
                                components.push(component);

                            const singleComponentGroup = new FormControl();
                            formControls.push(<ComponentControl>{
                                key: component.componentId,
                                control: singleComponentGroup
                            });
                            componentGroup[component.componentId] = singleComponentGroup;
                        });
                    sectionGroup[section.sectionId] = new FormGroup(componentGroup);
                });
            pageGroup[page.pageId] = new FormGroup(sectionGroup);
        });
        return { pageGroup: pageGroup, formControls: formControls, components: components };
    }

    public static deepCopy(oldObj: any, ignoreProperty: Array<string> = null) {
        let newObj = oldObj;
        if (oldObj && typeof oldObj === 'object') {
            newObj = Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
            for (const i in oldObj)
                if (!ignoreProperty || (ignoreProperty && !ignoreProperty.find(p => p === i)))
                    newObj[i] = this.deepCopy(oldObj[i]);
        }
        return newObj;
    }

    public static propertyCopy(source: any, target: any,  ignoreProperties: Array<string> = null) {
        if (source && typeof source === 'object')
            for (const i in source)
                if (!ignoreProperties || (ignoreProperties && !ignoreProperties.find( p => p === i)))
                    if (source[i] && typeof source[i] === 'object') {
                        if (!target[i])
                            target[i] = {};
                        target[i] = this.propertyCopy(source[i], target[i]);
                    } else
                        target[i] = source[i];
        else
            console.log(`propertyCopy function doesn't support primitives`);

        return target;
    }

    public static formatForGraphQl(obj: any) {
        const updatedData = this.deepCopy(obj);

        if (updatedData['__typename'])
            delete updatedData['__typename'];

        let dataForQuery = '';

        Object.keys(updatedData).forEach(fieldName => {
            if (updatedData[fieldName] == null)
                dataForQuery += fieldName + ': null,';
            else if (typeof updatedData[fieldName] === 'object')
                dataForQuery += this.formatForGraphQl(updatedData[fieldName]);
            else if (typeof updatedData[fieldName] === 'number' || typeof updatedData[fieldName] === 'boolean')
                dataForQuery += fieldName + `:${updatedData[fieldName]},`;
            else
                dataForQuery += fieldName + `:\"${updatedData[fieldName]},`;
        });
        dataForQuery = `{${dataForQuery.slice(0, -1)}}`;
        return dataForQuery;

    }

    public static formatError(error: FormError) {
        if (!error)
            return;

        if (error.error && error.error.message)
            error.message = error.error.message;

        return error;
    }

    public static maskToArray(mask: string) {
        const result = [];
        if (mask) {
            const maskTrimmed = mask.trim().substring(1).slice(0, -1).replace('\\\\', '\\');
            const arry = maskTrimmed.split(',');
            arry.forEach(item => {
                result.push(item.trim().replace(/\"/g, '').replace(/\'/g, ''));
            });
        }
        return result;
    }

    public static updateTemplates(form: FormWindow, objectId: string = null): FormWindow {
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

    public static resetValidators(components: Array<FormComponent<any>>, formControls: Array<ComponentControl>,
        componentFactoryResolver: ComponentFactoryResolver): Array<ComponentControl>  {
        if (components && components.length > 0)
            components.forEach(component => {
                if (component != null) {
                    const componentControl = formControls.find(fc => fc.key === component.componentId);
                    componentControl.control = HelperService.setValidators(componentFactoryResolver,
                            component, componentControl.control);
                }
            });
        return formControls;
    }

    public static validateForm(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl)
                control.markAsTouched({ onlySelf: true });
            else if (control instanceof FormGroup)
                this.validateForm(control);
        });
    }
}
