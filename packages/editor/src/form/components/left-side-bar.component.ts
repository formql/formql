import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'formQLLeftSideBar',
    template: `<div class="flq-left-menu">
                    <div class="flq-left-menu-section">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm0 14H5V8h14v10z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
                    </div>
                    <div class="flq-left-menu-component">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z"/><path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"/></svg>
                    </div>
                </div>`,
    styleUrls: ['./left-side-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LeftSideBarComponent implements OnInit {

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



