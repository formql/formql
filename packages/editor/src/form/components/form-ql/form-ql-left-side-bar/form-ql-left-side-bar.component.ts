import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';


@Component({
    selector: 'formQLLeftSideBar',
    templateUrl: './form-ql-left-side-bar.component.html',
    styleUrls: ['./form-ql-left-side-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FormQlLeftSideBar implements OnInit {

    @Output() rightSideNavBarAction = new EventEmitter();
    
    step: number;

    constructor(
    ) {

    }

    ngOnInit(): void {

    }

    setStep(index: number) {
		this.step = index;
    }
    
    rightSideNavBarActionClick($event) {
        this.rightSideNavBarAction.emit($event)
    }

    saveForm() {
        this.rightSideNavBarAction.emit("saveForm");
    }



}



