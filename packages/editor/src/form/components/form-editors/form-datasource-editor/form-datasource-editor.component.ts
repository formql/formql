import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { FormDataSource } from '../../../models/model/form-window.model';

@Component({
    selector: 'form-datasource-editor',
    templateUrl: './form-datasource-editor.component.html',
    styleUrls: ['./form-datasource-editor.component.scss']
})
export class FormDatasourceEditorComponent implements OnInit {
    static componentName = "FormDatasourceComponent";

    // @Input() dataSource: FormDataSource;
    @Input() data: any;
    @Input() class: string;

    @Output() action = new EventEmitter<any>();

    query: string = "";
    mutation: string = "";
    updatedClass: string = "";

    constructor() { }

    ngOnInit() {
        // if (this.dataSource) {

        //     if (this.dataSource.query)
        //         this.query = JSON.parse(JSON.stringify(this.dataSource.query));
            
        //     if (this.dataSource.mutation)
        //         this.mutation = JSON.parse(JSON.stringify(this.dataSource.mutation));
        // }

        if (this.class)
            this.updatedClass = this.class;
    }

    save() {
        // this.dataSource.query = JSON.parse(JSON.stringify(this.query));
        // this.dataSource.mutation = JSON.parse(JSON.stringify(this.mutation));
        this.class = this.updatedClass;
        this.action.emit();
    }

    cancel() {
        this.action.emit();
    }

}
