import { Injectable, Component, Type, ComponentFactoryResolver } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ComponentValidator, FormComponent } from "../models/form-component.model";
import { controlNameBinding } from "@angular/forms/src/directives/reactive_directives/form_control_name";
import { ComponentFactory } from "@angular/core";
import { TargetLocator } from "selenium-webdriver";

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    public static dndContainsClass(handle, className) {
        if (handle != null) {
            let i = 0;
            while (i < 3) {
                if (handle != null && handle.className != null && handle.className.indexOf != null && handle.className.indexOf(className) != -1)
                    return true;

                handle = handle.parentElement;
                i++;
            }
            return false;
        }
        return false;
    }

    public static evaluateCondition(condition, data) {
        'use strict';
        let response = { value: false, error: null };

        if (condition && data && condition != "false") {

            if (condition == "true") {
                response.value = true;
                return response;
            }

            // let regex = new RegExp("(?<!=)=(?!=)");
            // if (regex.test(condition)) {
            //     response.error = "Assign sign not allowed";
            //     return response;
            // }

            let props = Object.keys(JSON.parse(JSON.stringify(data)));
            let params = [];

            for (let i = 0; i < props.length; i++)
                params.push(data[props[i]]);

            params.push(condition);

            props.push("condition");

            let expression = "'use strict';  let window = undefined; let document = undefined; let alert = undefined; let a = undefined; return " + condition + ";";

            props.push(expression);

            try {

                let evalFunc = new Function(...props);
                let value = evalFunc(...params);

                if (value == undefined)
                    response.error = "Property is undefined";
                else if (value == true)
                    response.value = true;
            }
            catch (err) {
                response.error = err;
            }
        }
        return response;
    }

    public static evaluateValue(path, data) {
        'use strict';

        let response = { value: null, error: null };

        let props = Object.keys(data);
        let params = [];

        for (let i = 0; i < props.length; i++)
            params.push(data[props[i]]);

        params.push(path);

        props.push("path");

        let expression = "'use strict';  let window = undefined; let document = undefined; let alert = undefined; let a = undefined; return " + path + ";";

        props.push(expression);

        try {

            let evalFunc = new Function(...props);
            let value = evalFunc(...params);

            if (value == undefined || value == null)
                response.value == null;
            else
                response.value = this.deepCopy(value);
        }
        catch (err) {
            return response.error = err;
        }
        return response;

    }

    public static resolveType(value, type) {
        if (value == null || value == undefined || value == '')
            return null;

        switch (type) {
            case "number":
                if (typeof value == "string")
                    value = value.replace(/[^\d\.]/g, '');

                return Number(value);

            default:
                return value;
        }
    }


    setPath(value, schema, data) {
        if (value == undefined || value == '')
            value = null;
        if (data && schema) {
            let key = schema;
            if (schema.indexOf('.') != -1) {
                let arr = schema.split('.');
                let item = data;
                for (let i = 0; i <= arr.length - 1; i++) {
                    key = arr[i];
                    if (!item[key])
                        item[key] = {};

                    if (i != arr.length - 1)
                        item = item[key];
                }
                item[key] = value;
            }
            else
                data[key] = value;
        }
        return data;
    }

    

    public static getFactory(componentFactoryResolver: ComponentFactoryResolver, componentName: string) {
        let factories = Array.from(componentFactoryResolver['_factories'].keys());
        let type = <Type<Component>>factories.find((x: any) => x.componentName === componentName);

        return componentFactoryResolver.resolveComponentFactory(type);
    }

    public static setValidators(componentFactoryResolver: ComponentFactoryResolver, component: FormComponent<any>, control: FormControl) {
        let factories = Array.from(componentFactoryResolver['_factories'].keys());
        let type = factories.find((x: any) => x.componentName == component.componentName);
        if (type != null && type["validators"] == null)
            return;

        let validators = [];
        if (component.properties != null) {
            let componentValidators = <Array<ComponentValidator>>type["validators"];
            Object.keys(component.properties).forEach(key => {
                let item = component.properties[key];
                if (item.value && item.key != "readonly" && item.key != "hidden" && item.key != "value") {
                    let validator = componentValidators.find(x => x.key == item.key);
                    if (validator && validator.validator)
                        validators.push(validator.validator);
                }
                else if (item.value && item.key == "readonly" && control.enabled)
                    control.disable();
            });
            if (control.disabled && (!component.properties || (component.properties && !component.properties.readonly) || (component.properties && component.properties.readonly && !component.properties.readonly.value)))
                control.enable();
        }

        if (validators.length > 0) {
            control.setValidators(validators);
            control.updateValueAndValidity({
                onlySelf: true
            });
        }
    }

    public static isNullOrEmpty(value) {
        return value == null || value == "";
    }

    public static deepCopy(oldObj: any, ignoreProperty: Array<string> = null) {
        var newObj = oldObj;
        if (oldObj && typeof oldObj === "object") {
            newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
            for (var i in oldObj) {
                if (!ignoreProperty || (ignoreProperty && !ignoreProperty.find(p=>p==i)))
                    newObj[i] = this.deepCopy(oldObj[i]);
            }
        }
        return newObj;
    }

    public static propertyCopy(source: any, target: any,  ignoreProperty: Array<string> = null) {
        if (source && typeof source === "object") {
            for (var i in source) {
                if (!ignoreProperty || (ignoreProperty && !ignoreProperty.find(p=>p==i)))
                {
                    if (source[i] && typeof source[i] === "object") 
                    {
                        if (!target[i])
                            target[i] = {};
                        this.propertyCopy(source[i], target[i]);
                    }
                    else
                        target[i] = source[i];
                }
            }
        }
        else
            console.log("propertyCopy doesn't support primitives");
    }

    public static formatForGraphQl(obj: any) {
        let updatedData = JSON.parse(JSON.stringify(obj));

        if (updatedData["__typename"])
            delete updatedData["__typename"];

        let dataForQuery = "";

        Object.keys(updatedData).forEach(fieldName => {
            if (updatedData[fieldName] == null)
                dataForQuery += fieldName + ": null,";
            else if (typeof updatedData[fieldName] === 'object')
                dataForQuery += this.formatForGraphQl(updatedData[fieldName]);
            else if (typeof updatedData[fieldName] === 'number' || typeof updatedData[fieldName] === 'boolean')
                dataForQuery += fieldName + ":" + updatedData[fieldName] + ","
            else
                dataForQuery += fieldName + ":\"" + updatedData[fieldName] + "\","
        });
        dataForQuery = "{" + dataForQuery.slice(0, -1) + "}";
        return dataForQuery;

    }

}