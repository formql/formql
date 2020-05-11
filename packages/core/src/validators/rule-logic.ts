import { FormComponent } from '../models/form-component.model';
import { FormState, FormComponents } from '../models/form-window.model';
import { EvalResponse } from '../models/type.model';
import { HelperService } from '../services/helper.service';

export class RuleLogic {

  private evalFunctions = ['GET', 'SUM'];

  constructor() { }

  /*
    Perform a condition evaluation
  */
  private doEval<U>(condition: string, conditionFunctions: object): U {

    const conditionFunctionsDeclares = Object.keys(conditionFunctions).map(x => `let ${x} = conditionFunctions.${x}; `).join('');

    if (condition.trim() === '')
      return;

    if (this.evalFunctions.indexOf(condition.trim()) !== -1)
      throw Error(`Funcitons need a parameter (e.g. GET('contact.firstName') )`);

    const props = [];
    const params = [];


    params.push(condition);
    params.push(conditionFunctions);

    props.push('condition');
    props.push('conditionFunctions');

    const expression = `
            'use strict'
            ${conditionFunctionsDeclares}
            let window = undefined;
            let document = undefined;
            let alert = undefined;
            let a = undefined;
            return ${condition};
        `;

    props.push(expression);

    try {
      const evalFunc = new Function(...props);
      const response = evalFunc(...params);
      return response;
    } catch (err) {
      debugger; // intentionally left to help troubleshooting issues
      console.log(err);
      throw err;
    }
  }

  /*
    Reset all dependancies for any given condition in a component
  */
  public resetDependancies<T, U>(formState: FormState, condition: string, component: FormComponent<T>): U {
    'use strict';
    const self = this;
    const registerFunctions = {
      GET(schema: string) {
        formState.components = self.setDependents(formState.components, schema, component.componentId);
      },
      SUM(...schemas: string[]) {
        schemas.forEach(schema => formState.components = self.setDependents(formState.components, schema, component.componentId));
      }
    };
    return this.doEval(condition, registerFunctions);
  }

  /*
    Evaluetes the value of any given condition
  */
  public evaluate<T, U>(data: T, condition: string): U {
    'use strict';
    const self = this;
    const evalFunctions = {
      GET(schema: string) {
        const result = self.getSchemaValue(data, schema);
        if (result !== undefined && result !== null)
          return result;
        else
          return '';
      },
      SUM(...schemas: string[]) {
        let total = 0;
        schemas.forEach(schema => {
          const value = self.getSchemaValue(data, schema) as number;
          if (value && !isNaN(value))
            total += value;
        });
        return total;
      }
    };
    return this.doEval(condition, evalFunctions);
  }

  public evaluateCondition<T>(data: T, condition: string): EvalResponse {
    const response = { value: false, error: null } as EvalResponse;

    if (condition && condition.trim() !== '' && condition !== 'false') {

      if (condition === 'true') {
        response.value = true;
        return response;
      }

      if (!data)
        return response;

      try {
        response.value = this.evaluate(data, condition);
      } catch (err) {
        response.error = err;
      }

      if (response.value !== true)
        response.value = false;
    }
    return response;
  }

  public evaluateValue<T>(data: T, expression: string): EvalResponse {
    const response = { value: null, error: null } as EvalResponse;

    if (!data)
      return response;

    try {
      response.value = this.evaluate(data, expression);
    } catch (err) {
      response.error = err;
      return response;
    }

    if (Number.isNaN(response.value) || response.value === Infinity)
      response.value = null;
    else
      response.value = HelperService.deepCopy(response.value);

    return response;
  }


  private getSchemaValue<T, U>(data: T, schema: string): U {
    const evalFunc = new Function('data', 'schema', `return data.${schema}`);
    return evalFunc(data, schema) as U;
  }

  private setDependents(components: FormComponents, schema: string, componentId: string): FormComponents {
    Object.keys(components).forEach((key) => {
      const component = components[key];
      if (component.schema === schema) {
        if (!component.dependents)
          component.dependents = [componentId];
        else if (component.dependents.indexOf(componentId) === -1)
          component.dependents.push(componentId);
      }
    });
    return components;
  }
}
