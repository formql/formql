import { Injectable, Component, Type, ComponentFactoryResolver } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentValidator, FormComponent } from '../models/form-component.model';
import { FormError } from '../models/form-window.model';
import { ComponentFactory } from '@angular/core';
import { EvalResponse } from '../models/type.model';

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
            return response.error = err;
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

    public static setValidators(componentFactoryResolver: ComponentFactoryResolver, component: FormComponent<any>, control: FormControl) {
        const factories = Array.from(componentFactoryResolver['_factories'].keys());
        const type = factories.find((x: any) => x.componentName === component.componentName);
        if (type && (!type['validators'] || (type['validators'] && type['validators'].length === 0)))
            return component;

        const validators = [];
        if (component.properties != null) {
            const componentValidators = <Array<ComponentValidator>>type['validators'];
            Object.keys(component.properties).forEach(key => {
                const item = component.properties[key];
                if (item.value && item.key !== 'readonly' && item.key !== 'hidden' && item.key !== 'value') {
                    const validator = componentValidators.find(x => x.key === item.key);
                    if (validator && validator.validator)
                        validators.push(validator.validator);
                } else if (item.value && item.key === 'readonly' && control.enabled)
                    control.disable();
            });
            if (control.disabled &&
                (!component.properties || (component.properties && !component.properties.readonly) || 
                (component.properties && component.properties.readonly && !component.properties.readonly.value)))
                control.enable();
        }

        if (validators.length > 0) {
            control.setValidators(validators);
            control.updateValueAndValidity({
                onlySelf: true
            });
        }
        return component;
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
}