import { FormComponent } from "../models/form-component.model";
import { FormService } from "../services/form.service";
import { FormState } from "../models/form-window.model";

export class RuleLogic {

    constructor(
        private formService: FormService, private formState: FormState, private subject: FormComponent<any>
    ){}

    private doEval(rule: string, ruleFunctions: object) {

        const ruleFunctionsDeclares = Object.keys(ruleFunctions).map(x => `let ${x} = ruleFunctions.${x}; `).join('');

        const props = Object.keys(this.formState.data);
        const params = [];

        for (let i = 0; i < props.length; i++) {
            params.push(this.formState.data[props[i]]);
        }

        params.push(rule);
        params.push(ruleFunctions);

        props.push('rule');
        props.push('ruleFunctions');


        const expression = `
            'use strict'
            ${ruleFunctionsDeclares}
            let window = undefined;
            let document = undefined;
            let alert = undefined;
            let a = undefined;
            return ${rule};
        `;

        props.push(expression);

        try {
            const evalFunc = new Function(...props);
            return evalFunc(...params);
        } catch (err) {
            console.log(err);
        }
    }

    public register(rule: string) {
        'use strict';
        let formService = this.formService;
        let formState = this.formState;
        let subject = this.subject;

        let registerFunctions = {
            GET(schema: string) {
                formService.addSchemaDependent(formState, schema, subject);
            }
        }
        
        this.doEval(rule, registerFunctions)
    }

    public evaluate(rule: string): any {
        let formService = this.formService;
        let formState = this.formState;

        let evalFunctions = {
            GET(schema: string) {
                return formService.getSchemaValue(formState, schema);
            }
        }
       
        return this.doEval(rule, evalFunctions);      
   }
}