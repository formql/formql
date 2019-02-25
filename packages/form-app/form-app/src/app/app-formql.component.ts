import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormQLMode } from '@formql/core';


@Component({
    selector: 'app-formql',
    template: `<formql [mode]="mode" [formName]="formName"></formql>`,
})
export class AppFormQLComponent implements OnInit {

    title = 'app';
    mode: FormQLMode = FormQLMode.View;
    formName: string;

    constructor(
        private route: ActivatedRoute
    ) {
        let routeSnap = this.route.snapshot;
        if (this.isEditMode(routeSnap))
            this.mode = FormQLMode.Edit;
        else if (this.idLiveEditMode(routeSnap))
            this.mode = FormQLMode.LiveEdit;

        if (this.formName == null)
            this.formName = routeSnap.params["name"];

            
    }

    ngOnInit(): void {

    }

    private isEditMode(routeSnap) {
        return (routeSnap.url.join("/").indexOf("/edit") != -1 || (routeSnap.parent != null && routeSnap.parent.url.join("/").indexOf("/edit") != -1));
    }

    private idLiveEditMode(routeSnap) {
        return (routeSnap.url.join("/").indexOf("/liveEdit") != -1 || (routeSnap.parent != null && routeSnap.parent.url.join("/").indexOf("/liveEdit") != -1));
    }
}
