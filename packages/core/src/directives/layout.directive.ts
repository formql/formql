import { Directive, ElementRef, Input, ViewContainerRef, TemplateRef, Renderer2 } from '@angular/core';
import { GridStyle } from '../models/grid-style.model';

@Directive({
    selector: '[gdConfig][gdConfigOf]'
})
export class LayoutDirective {
    constructor(private view: ViewContainerRef,
        private el: ElementRef,
        private renderer: Renderer2,
        private template: TemplateRef<any>) { }

    @Input()
    set gdConfigOf(config: GridStyle) {
        this.view.clear();

        this.setParentAttributes(config);

        let list = this.getGridStyleList(config);
        if (list)
            list.forEach((item, index) => {
                this.view.createEmbeddedView(this.template, {
                    $implicit: item,
                    index
                });
            });
    }

    /**
     * Get a list with the grid styling 
     * 
     * @param style: style configuration
     */
    getGridStyleList(config: GridStyle) {
        if (config) {
            let divList = [];
            const rowsDefArr = config.gridTemplateAreas.split('" "');
            let style = {};
            if (config.gridTemplateColumns) {
                style["grid-template-columns"] = config.gridTemplateColumns;
                style["-ms-grid-columns"] = style["grid-template-columns"];
            }
            if (config.gridTemplateRows) {
                style["grid-template-rows"] = config.gridTemplateRows;
                style["-ms-grid-rows"] = style["grid-template-rows"];
            }
            let idList = [];

            for (let i = 0; i < rowsDefArr.length; i++) {
                let rowArr = rowsDefArr[i].split(" ");
                for (let y = 0; y < rowArr.length; y++) {
                    let cell = rowArr[y].replace(/\"/g, "");
                    let existingCell = divList.find(x => x.id === cell);
                    if (!existingCell) {
                        idList.push(cell);
                        divList.push(
                            {
                                id: cell,
                                style: { "grid-area": cell, "-ms-grid-row": i + 1, "-ms-grid-row-span": 1, "-ms-grid-column": y + 1, "-ms-grid-column-span": 1 }
                            });
                    }
                    else
                        existingCell.style["-ms-grid-row"] - 1 === i ? existingCell.style["-ms-grid-column-span"]++ : existingCell.style["-ms-grid-row-span"]++;
                }
            }
            return divList;
        }
        return null;
    }

    /**
     * Set the appropiate css grid attributes for the parent object
     * 
     * @param style 
     */
    setParentAttributes(config: GridStyle) {
        let parentElement = <HTMLElement>this.el.nativeElement.parentElement;
        if (!parentElement)
            parentElement = <HTMLElement>this.el.nativeElement.parentNode;

        let styleAttrValue = '';
        if (config.gridTemplateAreas)
            styleAttrValue += `grid-template-areas:${config.gridTemplateAreas};`;

        if (config.gridTemplateColumns) {
            styleAttrValue += `grid-template-columns:${config.gridTemplateColumns};`;
            styleAttrValue += `-ms-grid-columns:${config.gridTemplateColumns};`;
        }

        if (config.gridTemplateRows) {
            styleAttrValue += `grid-template-rows:${config.gridTemplateRows};`;
            styleAttrValue += `-ms-grid-rows:${config.gridTemplateRows};`;
        }

        if (config.style)
        {   
            let array = Object.keys(config.style);
            for (let i=0; i < array.length; i++)
                styleAttrValue += array[i] + ":" + config.style[array[i]] + ";";
        }



        if (styleAttrValue)
            this.renderer.setAttribute(parentElement, 'style', styleAttrValue);

    }

}