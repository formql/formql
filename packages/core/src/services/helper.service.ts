import { Injectable, Component, ComponentFactory } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormComponent } from '../models/form-component.model';
import { FormError, FormWindow, FormComponents, FormControls } from '../models/form-window.model';
import { EvalResponse } from '../models/type.model';
import { FormValidator } from '../models/rule.model';
import { ComponentResolverService } from './component-resolver.service';

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

      response = { ...this.evaluate(condition, data) };

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

    response = {...this.evaluate(path, data) };

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

  public static setValue<T, U>(schema: string, value: T, data: U): U {
    if (!schema || !data)
      return data;

    const evalFunc = new Function('data', 'value', `data.${schema} = value; return data;`);
    return evalFunc(data, value);
  }

  public static getValue<T>(schema: string, data: T, type: string) {
    if (!schema || !data || (data && Object.keys(data).length === 0 && data.constructor === Object))
      return;

    const evalFunc = new Function('data', `return data.${schema};`);
    return evalFunc(data);
  }

  public static setValidators(componentResolverService: ComponentResolverService,
    component: FormComponent<any>, control: FormControl): FormControl {

    const componentRef = componentResolverService.resolveComponent(component.componentName);

    if (!componentRef)
      return control;

    const type = componentRef.componentType;

    if (type && (!type['validators'] || (type['validators'] && type['validators'].length === 0)))
      return control;

    const validators = [];
    const rules = component.rules;
    if (rules != null) {
      const FormValidators = <Array<FormValidator>>type['validators'];
      Object.keys(rules).forEach(key => {
        const item = rules[key];
        if (item.value && item.key !== 'readonly' && item.key !== 'hidden' && item.key !== 'value') {
          const validator = FormValidators.find(x => x.key === item.key);
          if (validator && validator.validator)
            validators.push(validator.validator);
        } else if (item.value && item.key === 'readonly' && control.enabled)
          control.disable();
      });
      if (control.disabled && (!rules || (rules && !rules.readonly) || (rules && rules.readonly && !rules.readonly.value)))
        control.enable();
    }
    if (validators.length > 0)
      control.setValidators(validators);

    return control;
  }

  public static createReactiveFormStructure<T>(form: FormWindow, data: T = null) {
    const formControls = {} as FormControls;
    const components = {} as FormComponents;
    const pageGroup = new FormGroup({});
    form.pages.forEach(page => {
      const sectionGroup: any = {};
      if (page.sections != null)
        page.sections.forEach(section => {
          const componentGroup: any = {};
          if (section.components != null)
            section.components.forEach(component => {

              components[component.componentId] = component;
              const singleComponentGroup = new FormControl();
              formControls[component.componentId] = singleComponentGroup;
              componentGroup[component.componentId] = singleComponentGroup;

              if (data)
                data = HelperService.instantiateData(data, component.schema);

              try {
                component.value = this.getValue(component.schema, data, component.type);
              } catch (err) {
                throw err;
              }

            });
          sectionGroup[section.sectionId] = new FormGroup(componentGroup);
        });
      pageGroup[page.pageId] = new FormGroup(sectionGroup);
    });
    return { pageGroup: pageGroup, formControls: formControls, components: components, data: data };
  }

  public static instantiateData<T>(data: T, schema: string): T {
    if (schema && schema.indexOf('.') !== -1) {
        const arr = schema.split('.');
        let item = data;
        let key = '';
        for (let i = 0; i <= arr.length - 2; i++) {
            key = arr[i];
            if (!item[key])
                item[key] = {};

            if (i !== arr.length - 2)
                item = item[key];
        }
    }
    return data;
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

  public static propertyCopy(source: any, target: any, ignoreProperties: Array<string> = null) {
    if (source && typeof source === 'object')
      for (const i in source)
        if (!ignoreProperties || (ignoreProperties && !ignoreProperties.find(p => p === i)))
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

  public static updateTemplates(form: FormWindow): FormWindow {
    form.pages.forEach(page => {
      page.template.reRender = false;
      page.template = HelperService.deepCopy(page.template);
      page.sections.forEach(section => {
        section.template.reRender = false;
        section.template = HelperService.deepCopy(section.template);
      });
    });
    return form;
  }

  public static resetValidators(components: FormComponents, formControls: FormControls,
    componentResolverService: ComponentResolverService): FormControls {
    if (components && Object.keys(components).length > 0)
      Object.keys(components).forEach(key => {
        const component = components[key];
        if (component) {
          let componentControl = formControls[component.componentId];
          if (componentControl)
            componentControl = HelperService.setValidators(componentResolverService, component, componentControl);
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
