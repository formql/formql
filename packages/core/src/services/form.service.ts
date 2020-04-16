import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { FormWindow, FormState, FormDataSource, FormComponents } from '../models/form-window.model';
import { FormComponent } from '../models/form-component.model';
import { UUID } from 'angular2-uuid';
import { HelperService } from './helper.service';
import { IFormQLService } from '../interfaces/formql-service';
import { RuleLogic } from '../validators/rule-logic';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private service: IFormQLService;

  constructor(
    @Inject('FormQLService') srv
  ) {
    this.service = srv;
  }


  getFormAndData(formName: string, ids: Array<string>): Observable<FormState> {
    if (ids)
      return this.service.getForm(formName).pipe(
        map(response => <FormWindow>response),
        concatMap(model =>
          this.service.getData(model.dataSource, ids).pipe(
            map(data => this.populateComponents(model, data))
          )));
    else
      return this.service.getForm(formName).pipe(
        map(model => this.populateComponents(model, null))
      );
  }

  populateComponents(form: FormWindow, data: any): FormState {
    let formState = <FormState>{
      components: {} as FormComponents,
      data: { ...data },
      form: form
    };

    form.pages.forEach(page => {
      if (!page.pageId)
        page.pageId = UUID.UUID();

      if (page.sections != null)
        page.sections.forEach(section => {

          if (!section.sectionId)
            section.sectionId = UUID.UUID();

          if (section.components != null)
            section.components.forEach(component => {
              if (!component.componentId)
                component.componentId = UUID.UUID();

              component.value = this.getValue(component.schema, data, component.type);
              this.registerComponentDependencies(formState, component);
              formState.components[component.componentId] = component;

              if (!data)
                formState.data = this.initiateData(formState.data, component.schema);
            });
        });
    });
    formState = this.resolveConditions(formState);
    return formState;
  }

  registerComponentDependencies(formState: FormState, component: FormComponent<any>) {
    if (component.rules)
      Object.keys(component.rules).forEach(key => {
        const rule = component.rules[key];
        new RuleLogic(this, formState, component).register(rule.condition);
      });
  }

  initiateData(data: any, schema: string) {
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


  getValue(schema: string, data: any, type: string) {
    const evaluatedValue = HelperService.evaluateValue(schema, data);
    if (evaluatedValue.error)
      return null;
    else
      return HelperService.resolveType(evaluatedValue.value, type);
  }

  setValue(schema: string, value: any, data: any) {
    if (value === undefined || value === '')
      value = null;
    if (schema) {
      if (!data)
        data = {};
      let key = schema;
      if (schema.indexOf('.') !== -1) {
        const arr = schema.split('.');
        let item = data;
        for (let i = 0; i <= arr.length - 1; i++) {
          key = arr[i];
          if (!item[key])
            item[key] = {};

          if (i !== arr.length - 1)
            item = item[key];
        }
        item[key] = value;
      } else
        data[key] = value;
    }
    return data;
  }

  getData(query: FormDataSource, ids: Array<string>) {
    return this.service.getData(query, ids).pipe(
      map((data: any) => {
        if (data)
          return data;
        else
          return {};
      }));
  }

  getForms() {
    return this.service.getForms().pipe(
      map((data: any) => {
        return data;
      }));
  }

  getForm(name: string) {
    return this.service.getForm(name).pipe(
      map((data: FormWindow) => {
        return data;
      }));
  }

  saveForm(name: string, form: FormWindow) {
    // remove all transactional data
    const updateForm = HelperService.deepCopy(form);
    updateForm.pages.forEach(page => {
      page.sections.forEach(section => {
        section.components.forEach(component => {
          component.value = null;
          if (component.rules != null)
            Object.keys(component.rules).forEach(p => {
              component.rules[p].value = null;
            });
        });
      });
    });

    return this.service.saveForm(name, updateForm).pipe(
      map((response: any) => {
        return response;
      }));
  }

  saveData(dataSource: FormDataSource, ids: Array<string>, data: any) {
    return this.service.saveData(dataSource, ids, data).pipe(
      map((result: any) => {
        return result;
      }));
  }

  updateComponent(component: FormComponent<any>, formState: FormState) {
    const value = HelperService.resolveType(component.value, component.type);
    formState.data = this.setValue(component.schema, value, formState.data);

    // refresh any dependent components
    if (component.dependents)
      component.dependents.forEach(key => {
        this.resolveComponentRules(formState.components[key], formState);
      });

    // set the value on any components that have the same schema
    Object.keys(formState.components).forEach(key => {
      const c = formState.components[key];
      if (c.schema === component.schema)
        c.value = this.getValue(c.schema, formState.data, c.type);
    });
    return formState;
  }

  addSchemaDependent(formState: FormState, schema: string, component: FormComponent<any>) {
    Object.keys(formState.components).forEach((key) => {
      const c = formState.components[key];
      if (c.schema === schema) {
        if (c.rules) {
          if (!c.dependents)
            c.dependents = [component.componentId];
          else if (c.dependents.indexOf(key) === -1)
            c.dependents.push(component.componentId);
        }
      }
    });
  }

  getSchemaValue(formState: FormState, schema: string) {
    const evalFunc = new Function('data', 'schema', `return data.${schema}`);
    return evalFunc(formState.data, schema);
  }

  // updateComponent(component: FormComponent<any>, formState: FormState) {
  //     const value = HelperService.resolveType(component.value, component.type);
  //     formState.data = this.setValue(component.schema, value, formState.data);
  //     formState = this.resolveConditions(formState);
  //     formState.components.forEach((c: FormComponent<any>) => {
  //         if (c.schema === component.schema || (c.schema && c.schema.indexOf('.') === -1))
  //             c.value = this.getValue(c.schema, formState.data, c.type);
  //     });
  //     return formState;
  // }

  resolveComponentRules(component: FormComponent<any>, formState: FormState) {
    if (component.rules)
      Object.keys(component.rules).forEach(key => {
        const property = component.rules[key];
        if (property.condition) {
          const evaluatedValue = new RuleLogic(this, formState, component).evaluate(property.condition);

          if (key === 'value') {
            const value = HelperService.resolveType(evaluatedValue, component.type);
            if (component.value !== value) {
              component.value = value;
              this.updateComponent(component, formState);
            }
          }
          property.value = evaluatedValue;
        } else
          delete component.rules[key];
      });
  }

  resolveConditions(formState: FormState, reRun = false): FormState {
    let recalculate = false;
    // recalculate the calculated values as they might be dependant from each other
    if (recalculate) {
      recalculate = false;
      const components = formState.components;
      Object.keys(components).
        filter(key => components[key] &&
          components[key].rules &&
          components[key].rules['value'] &&
          components[key].rules['value'].condition).
        forEach(key => {
          const component = components[key];
          const property = component.rules['value'];
          const evaluatedValue = HelperService.evaluateValue(property.condition, formState.data);
          if (!evaluatedValue.error) {
            const value = HelperService.resolveType(evaluatedValue.value, component.type);
            if (component.value !== value) {
              recalculate = true;
              component.value = value;
              formState.data = this.setValue(component.schema, value, formState.data);
              property.value = true;
            }
          }
        });
      if (recalculate && !reRun)
        formState = this.resolveConditions(formState, true);
    }
    return formState;
  }
}

