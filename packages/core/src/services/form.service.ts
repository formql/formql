import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, InjectionToken, ReflectiveInjector, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, switchMap, flatMap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of';

import { FormWrapper } from '../models/form-wrapper.model';
import { FormComponent } from '../models/form-component.model';
import { FormState } from '../store/form.state';
import { UUID } from 'angular2-uuid';
import { HelperService } from './helper.service';
import { IFormQLService } from '../interfaces/formql-service';

@Injectable()
export class FormService {

    private form: FormWrapper;
    private components: Array<FormComponent<any>>;
    private data: any;

    // in case you have an API
    private COUNT = 3;
    private service: IFormQLService;



    constructor(@Inject("FormQLService") srv,
        private http: HttpClient, 
        ) {
        this.service = srv;
    }

    getFormAndData(formName: string, ids: Array<string>): Observable<FormState> {
        if (ids)
        {   
            return this.service.getForm(formName).pipe(
                map(res => <FormWrapper>res),
                switchMap(model =>
                    this.service.getData(model.dataSource.query, ids).pipe(
                        tap(data => this.populateComponents(model, data)),
                        map(result => <FormState>{ components: this.components, form: this.form, data: this.data })
                    )));
        }
        else
        {
            return this.service.getForm(formName).pipe(
                tap(model => this.populateComponents(model, new Object())),
                map(result => <FormState>{ components: this.components, form: this.form, data: new Object() }));
        }
    }

    populateComponents(form: FormWrapper, data: any) {
        this.components = new Array<FormComponent<any>>();
        this.form = form;
        if (data)
            this.data = JSON.parse(JSON.stringify(data));

        form.pages.forEach(page => {

            if (!page.pageId)
                page.pageId = UUID.UUID();

            if (page.sections != null) {
                page.sections.forEach(section => {

                    if (!section.sectionId)
                        section.sectionId = UUID.UUID();

                    if (section.components != null) {
                        section.components.forEach(component => {
                            if (!component.componentId)
                                component.componentId = UUID.UUID();

                            component.value = this.getValue(component.schema);
                            this.components.push(component);

                        });
                    }
                });
            }
        });
        this.resolveConditions();

    }

    populateComponentsAsync(form: FormWrapper, data: any) {
        return Observable.create(observer => {
            this.components = new Array<FormComponent<any>>();
            this.form = form;
            if (data)
                this.data = JSON.parse(JSON.stringify(data));

            form.pages.forEach(page => {

                if (!page.pageId)
                    page.pageId = UUID.UUID();

                if (page.sections != null) {
                    page.sections.forEach(section => {

                        if (!section.sectionId)
                            section.sectionId = UUID.UUID();

                        if (section.components != null) {
                            section.components.forEach(component => {
                                if (!component.componentId)
                                    component.componentId = UUID.UUID();

                                component.value = this.getValue(component.schema);
                                this.components.push(component);

                            });
                        }
                    });
                }
            });
            this.resolveConditions();
            observer.next(null);
            observer.complete();
        });
        

    }

    getValue(schema) {
        if (schema && this.data) {
            if (schema.indexOf('.') != -1) {
                let arr = schema.split('.');
                if (this.data[arr[0]]) {
                    let value = this.data[arr[0]];
                    for (let i = 1; i < arr.length; i++) {
                        if (value[arr[i]])
                            value = value[arr[i]];
                        else
                            return;
                    }
                    return value;
                }
            }
            else
                if (this.data[schema])
                    return this.data[schema];
        }
        return;
    }

    setValue(value, schema) {
        if (value == undefined || value == '')
            value = null;
        if (this.data && schema) {
            let key = schema;
            if (schema.indexOf('.') != -1) {
                let arr = schema.split('.');
                let item = this.data;
                for (let i = 0; i <= arr.length - 1; i++) 
                {
                    key = arr[i];
                    if (!item[key])
                        item[key] = {};
                    
                    if (i != arr.length - 1)
                        item = item[key];
                }
                item[key] = value;
            }
            else
                this.data[key] = value;
        }
        return this.data;
    }


    getData(query: string, ids: Array<string>) {

        return this.service.getData(query, ids).pipe(
            map((data: any) => {
                if (data)
                    return data;
                else
                    return {};
            }));
    }

    /**
     * Get Forms
     */
    getForms() {
        return this.service.getForms().pipe(
            map((data: any) => {
                return data;
            }));
    }

    /**
     * Get Form
     * @param name 
     */
    getForm(name: string) {
        return this.service.getForm(name).pipe(
            map((data: FormWrapper) => {
                return data;
            }));
    }

    /**
     * Save Form 
     * @param model 
     */
    saveForm(name: string, form: FormWrapper) {
        // remove all transactional data 
        let updateForm = JSON.parse(JSON.stringify(form));
        updateForm.pages.forEach(page => {
            page.sections.forEach(section => {
                section.components.forEach(component => {
                    component.value = null;
                    if (component.properties != null) {
                        Object.keys(component.properties).forEach(p => {
                            component.properties[p].value = null;
                        });
                    }
                });
            });
        });

        return this.service.saveForm(name, updateForm).pipe(
            map((data: any) => {
                return this.form;
            }));
    }

    /**
     * Save Form 
     * @param model 
     */
    saveData(mutation: string, ids: Array<string>, data: any) {
        
        return this.service.saveData(mutation, ids, data).pipe(
            map((data: any) => {
                return data;
            }));
    }

    updateComponent(component: FormComponent<any>) {
        let value = HelperService.resolveType(component.value, component.type);
        this.setValue(value, component.schema);
        this.components = this.components.map((f: FormComponent<any>) => {
            if (f.schema == component.schema || (f.schema && f.schema.indexOf('.') == -1))
                f.value = this.getValue(f.schema);
            return f.componentId === component.componentId ? component : f;
        });
        this.resolveConditions();
        return of({ component: component, data: this.data, components: this.components });
    }

    updateForm(form: FormWrapper) {
        this.form = form;
        return of({ form: form });
    }


    resolveConditions() {
        this.components.forEach(c => {
            if (c.properties) {
                Object.keys(c.properties).forEach(key => {
                    if (key=="value")
                    {
                        let p = c.properties[key];
                        if (!HelperService.isNullOrEmpty(p.condition)) {
                            let obj = HelperService.evaluateValue(p.condition, this.data);
                            if (!obj.error) {
                                let value = HelperService.resolveType(obj.value, c.type);
                                this.setValue(value,c.schema);
                                c.value = value;
                                p.value = true;
                                return;
                            }
                            else
                                p.value = false;
                        }
                        else
                            p.value = false;
                    }
                    else
                    {
                        let p = c.properties[key];
                        if (!HelperService.isNullOrEmpty(p.condition)) {
                            let obj = HelperService.evaluateCondition(p.condition, this.data);
                            if (!obj.error && obj.value) {
                                p.value = true;
                                return;
                            }
                            else
                                p.value = false;
                        }
                        else
                            p.value = false;
                    }
                });
                return;
            }
            if (c.properties)
                c.properties = null;
        });
    }

    
}

