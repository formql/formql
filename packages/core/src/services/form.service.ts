import { Inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { IFormQLService } from '../interfaces/formql-service';
import { FormComponent } from '../models/form-component.model';
import { FormPage } from '../models/form-page.model';
import { FormSection } from '../models/form-section.model';
import { FormDataSource, FormState, FormWindow } from '../models/form-window.model';
import { RuleLogic } from '../validators/rule-logic';
import { ComponentResolverService } from './component-resolver.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private injectedService: IFormQLService;

  private ruleLogic = new RuleLogic();

  constructor(
    @Inject('FormQLService') srv,
    private componentResolverService: ComponentResolverService,
    private formBuilder: FormBuilder
  ) {
    this.injectedService = srv;
  }

  public getFormAndData(formName: string, ids: Array<string>): Observable<FormState> {
    if (ids)
      return this.injectedService.getForm(formName).pipe(
        map((response) => <FormWindow>response),
        concatMap((model) =>
          this.injectedService.getData(model.dataSource, ids).pipe(map((data) => this.initialiseFormState(model, data)))
        )
      );
    else return this.injectedService.getForm(formName).pipe(map((model) => this.initialiseFormState(model, null)));
  }

  /*
    Invokes the form save in the injected service (see constructor for service)
  */
  public saveForm<T, U>(name: string, form: FormWindow): Observable<T> {
    // remove all transactional data
    const updateForm = HelperService.deepCopy(form);
    updateForm.pages.forEach((page: FormPage) => {
      page.sections.forEach((section: FormSection) => {
        section.components.forEach((component: FormComponent<U>) => {
          Object.keys(component)
            .filter((key) => component[key] === null)
            .forEach((key) => delete component[key]);
          delete component.value;
          if (component.rules)
            if (Object.keys(component.rules).length === 0 && component.rules.constructor === Object)
              delete component.rules;
            else
              Object.keys(component.rules).forEach((p) => {
                delete component.rules[p].value;
              });
        });
      });
    });

    return this.injectedService.saveForm(name, updateForm).pipe(
      map((response: T) => {
        return response;
      })
    );
  }

  /*
    Invokes the data save in the injected service (see constructor for service)
  */
  public saveData<T>(dataSource: FormDataSource, ids: Array<string>, data: T): Observable<T> {
    return this.injectedService.saveData(dataSource, ids, data).pipe(
      map((result: T) => {
        return result;
      })
    );
  }

  /*
    Updates a component value and recalculates all dependents
    If reset is set to true, it will recalculate all dependents, this is when a rules as been
    modified in the FormQL Editor
  */
  public updateComponent<T>(component: FormComponent<T>, formState: FormState, reset: boolean = false): FormState {
    const value = HelperService.resolveType(component.value, component.type);
    formState.data = HelperService.setValue(component.schema, value, formState.data);

    if (reset) this.resetComponentDependents(formState);

    // refresh any dependent components
    if (component.dependents)
      component.dependents.forEach((key) => {
        formState.components[key] = this.resolveComponentRules(formState.components[key], formState);
      });

    // set the value on any components that have the same schema
    Object.keys(formState.components).forEach((key) => {
      const c = formState.components[key];
      if (c.schema === component.schema)
        try {
          c.value = HelperService.getValue(c.schema, formState.data, c.type);
        } catch (err) {
          throw err;
        }
    });
    return formState;
  }

  /*
    Initialises Form State
  */
  public initialiseFormState<T>(form: FormWindow, data: T): FormState {
    const reactiveFormStructure = HelperService.createReactiveFormStructure(form, true, data);
    const formState = <FormState>{
      components: reactiveFormStructure.components,
      data: { ...reactiveFormStructure.data },
      form: form,
      formControls: reactiveFormStructure.formControls,
      reactiveForm: this.formBuilder.group(reactiveFormStructure.pageGroup)
    };
    return this.resolveConditions(formState);
  }

  /*
    Resets all component dependents, it should only be called when a user modified a question in the formql editor
  */
  private resetComponentDependents(formState: FormState): void {
    if (formState.components) {
      Object.keys(formState.components).forEach((componentKey) => delete formState.components[componentKey].dependents);
      Object.keys(formState.components).forEach((componentKey) => {
        const component = formState.components[componentKey];
        if (component.rules)
          Object.keys(component.rules).forEach((ruleKey) => {
            const rule = component.rules[ruleKey];
            this.ruleLogic.resetDependancies(formState, rule.condition, component);
          });
      });
      Object.keys(formState.components).forEach(
        (componentKey) =>
          (formState.components[componentKey] = this.resolveComponentRules(
            formState.components[componentKey],
            formState
          ))
      );
    }
  }

  private getData<T>(query: FormDataSource, ids: Array<string>): Observable<T | {}> {
    return this.injectedService.getData(query, ids).pipe(
      map((data: T) => {
        if (data) return data;
        else return {};
      })
    );
  }

  private getForms<T>(): Observable<T> {
    return this.injectedService.getForms().pipe(
      map((data: T) => {
        return data;
      })
    );
  }

  private getForm(name: string) {
    return this.injectedService.getForm(name).pipe(
      map((data: FormWindow) => {
        return data;
      })
    );
  }

  /*
    Resolve all rules for any given component
  */
  private resolveComponentRules<T>(component: FormComponent<T>, formState: FormState): FormComponent<T> {
    if (component.rules) {
      let resetValidator = false;
      Object.keys(component.rules).forEach((key) => {
        const property = component.rules[key];
        if (property.condition) {
          resetValidator = true;
          const evaluatedValue = this.ruleLogic.evaluate(formState.data, property.condition);

          if (key === 'value') {
            const value = HelperService.resolveType(evaluatedValue, component.type);
            if (component.value !== value) {
              component.value = value as T;
              formState = this.updateComponent(component, formState);
            }
          }
          property.value = evaluatedValue as boolean;
        } else delete component.rules[key];
      });
      if (resetValidator)
        formState.formControls[component.componentId] = HelperService.setValidators(
          this.componentResolverService,
          component,
          formState.formControls[component.componentId]
        );
    }
    return component;
  }

  /*
    Resolves all conditions in each component, used when initialising the form
  */
  public resolveConditions(formState: FormState): FormState {
    if (formState.components) {
      const components = formState.components;
      Object.keys(components).forEach(
        (componentKey) => (components[componentKey] = this.resolveComponentRules(components[componentKey], formState))
      );
    }
    return formState;
  }
}
