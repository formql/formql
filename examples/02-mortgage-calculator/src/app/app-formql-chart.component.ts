import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { FormValidator, FormComponent } from '@formql/core';

@Component({
    selector: 'app-formql-chart',
    template: `<div id="chart-container">
                    <canvas *ngIf="chartData && !noData"  baseChart 
                        [chartType]="'doughnut'"
                        [data]="chartData"
                        [labels]="chartConfig.ChartLabels"
                        >
                </canvas>
                </div>
                <div *ngIf="noData">No Data</div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AppFormQLChartComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => AppFormQLChartComponent),
            multi: true
        }]
})
export class AppFormQLChartComponent implements OnInit, ControlValueAccessor {
    static componentName = 'AppFormQLChartComponent';
    static formQLComponent = true;
    static validators = [
        <FormValidator>{
            name: 'Required',
            validator: Validators.required,
            key: 'required'
        }
    ];

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;
    @Input() tabIndex: string;

    private _value: string;
    public mask: any;
    public chartConfig: ChartConfiguration;
    public chartData: any;
    public noData = true;

    private _propagateChange = (_: any) => { };


    get value(): any {

        return this._value;
    }

    set value(value: any) {
        this._value = value;
        this._propagateChange(this._value);
    }

    writeValue(value: string): void {
        if (value)
            this._value = value;
    }

    registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }

    ngOnInit() {
        if (this.field && this.field.configuration)
            this.chartConfig = <ChartConfiguration>this.field.configuration;

        this.formControl.parent.parent.valueChanges.subscribe(val => {
            if (this.chartConfig && this.chartConfig.ChartValueMap) {
                this.chartData = [];
                this.noData = false;
                this.chartConfig.ChartValueMap.forEach((valueMap, index)=> {
                    let value = 0;
                    if (this.field.value && this.field.value[valueMap])
                        value = this.field.value[valueMap];

                    if (this.chartData[index] != null )
                        this.chartData[index] = value;
                    else
                        this.chartData.push(value);

                    if (value <= 0)
                        this.noData = true;
                });
            }
        });

    }
}

export class ChartConfiguration {
    public ChartLabels: Array<string>;
    public ChartValueMap: Array<string>;
}



