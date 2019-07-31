import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormQLMode } from '@formql/core';

@Component({
    selector: 'app-formql-editor',
    styles: [`.mainDiv { position: absolute; top: 0; left: 0; right: 0;bottom: 0;}`],
    template: `<div class="mainDiv">
                <formql-editor [mode]="mode" [formName]="formName" [ids]="ids" 
                        [pathOpenViewMode]="'/#/form/{0}'"></formql-editor>
                </div>`,
})
export class AppFormQLEditorComponent implements OnInit {

    title = 'app';
    mode: FormQLMode = FormQLMode.View;
    formName: string;
    ids: Array<string>;

    constructor(
        private route: ActivatedRoute
    ) {
        let routeSnap = this.route.snapshot;
        if (this.isEditMode(routeSnap))
            this.mode = FormQLMode.Edit;
        
        if (routeSnap.params["name"])
            this.formName = routeSnap.params["name"];
        
        if (routeSnap.params["id"]) {
            this.ids = [routeSnap.params["id"]];
        }   
    }

    ngOnInit(): void {

    }

    private isEditMode(routeSnap) {
        return (routeSnap.url.join("/").indexOf("/edit") != -1 || (routeSnap.parent != null && routeSnap.parent.url.join("/").indexOf("/edit") != -1));
    }
}
