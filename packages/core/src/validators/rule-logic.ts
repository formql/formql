import { FormComponent } from '../models/form-component.model';
import { FormState, FormComponents } from '../models/form-window.model';

export class RuleLogic {

  private evalFunctions = ['GET', 'SUM'];

  constructor() { }

  /*
    Perform a condition evaluation
  */
  private doEval(formState: FormState, condition: string, conditionFunctions: object): any {

    const conditionFunctionsDeclares = Object.keys(conditionFunctions).map(x => `let ${x} = conditionFunctions.${x}; `).join('');

    const props = Object.keys(formState.data);
    const params = [];

    for (let i = 0; i < props.length; i++)
      params.push(formState.data[props[i]]);

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
    }
  }

  /*
    Reset all dependancies for any given condition in a component
  */
  public resetDependancies(formState: FormState, condition: string, component: FormComponent<any>): any {
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
    return this.doEval(formState, condition, registerFunctions);
  }

  /*
    Evaluetes the value of any given condition
  */
  public evaluate(formState: FormState, condition: string): any {
    'use strict';
    const self = this;
    const evalFunctions = {
      GET(schema: string) {
        const result = self.getSchemaValue(formState, schema);
        if (result !== undefined && result !== null)
          return result;
        else
          return '';
      },
      SUM(...schemas: string[]) {
        let total = 0;
        schemas.forEach(schema => {
          const value = self.getSchemaValue(formState, schema);
          if (value && !isNaN(value))
            total += parseFloat(value);
        });
        return total;
      }
    };
    return this.doEval(formState, condition, evalFunctions);
  }

  private getSchemaValue(formState: FormState, schema: string): any {
    const evalFunc = new Function('data', 'schema', `return data.${schema}`);
    return evalFunc(formState.data, schema);
  }

  private setDependents(components: FormComponents, schema: string, componentId: string) {
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
