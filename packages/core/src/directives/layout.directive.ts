import { Directive, ElementRef, Input, ViewContainerRef, TemplateRef, Renderer2 } from '@angular/core';
import { GridStyle } from '../models/style.model';

@Directive({
    selector: '[formqlGdConfig][formqlGdConfigOf]'
})
export class LayoutDirective {
    constructor(private view: ViewContainerRef,
        private el: ElementRef,
        private renderer: Renderer2,
        private template: TemplateRef<any>) { }

    @Input()
    set formqlGdConfigOf(config: GridStyle) {
        this.view.clear();

        this.setParentAttributes(config);

        const list = this.getGridStyleList(config);
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
            const divList = [];
            const rowsDefArr = config.gridTemplateAreas.split('" "');
            const style = {};
            if (config.gridTemplateColumns) {
                style['grid-template-columns'] = config.gridTemplateColumns;
                style['-ms-grid-columns'] = style['grid-template-columns'];
            }
            if (config.gridTemplateRows) {
                style['grid-template-rows'] = config.gridTemplateRows;
                style['-ms-grid-rows'] = style['grid-template-rows'];
            }
            const idList = [];

            for (let i = 0; i < rowsDefArr.length; i++) {
                const rowArr = rowsDefArr[i].split(' ');
                for (let y = 0; y < rowArr.length; y++) {
                    const cell = rowArr[y].replace(/\"/g, '');
                    const existingCell = divList.find(x => x.id === cell);
                    if (!existingCell) {
                        idList.push(cell);
                        divList.push(
                            {
                                id: cell,
                                style:  { 'grid-area': cell,
                                          '-ms-grid-row': i + 1,
                                          '-ms-grid-row-span': 1,
                                          '-ms-grid-column': y + 1,
                                          '-ms-grid-column-span': 1
                                        }
                            });
                    } else
                        existingCell.style['-ms-grid-row'] - 1 === i ?
                                existingCell.style['-ms-grid-column-span']++ :
                                existingCell.style['-ms-grid-row-span']++;
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

        if (config.style) {
            const array = Object.keys(config.style);
            for (let i = 0; i < array.length; i++)
                styleAttrValue += array[i] + ':' + config.style[array[i]] + ';';
        }

        if (styleAttrValue)
            this.renderer.setAttribute(parentElement, 'style', styleAttrValue);

    }

}