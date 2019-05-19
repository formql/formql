import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { FormValidator, FormComponent } from '@formql/core';

@Component({
    selector: 'app-formql-chart',
    template: `<div id="chart-container" style="margin: 0px auto; width: 500px">
                    <canvas *ngIf="chartData && chartLabels && !noData"  baseChart
                        [chartType]="'doughnut'"
                        [data]="chartData"
                        [labels]="chartLabels"
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
    public chartConfig: ChartConfiguration;
    public chartData: any;
    public chartLabels: Array<string>;
    public chartFields: Array<string>;

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
        if (this.field && this.field.configuration) {
            this.chartConfig = <ChartConfiguration>this.field.configuration;

            if (!this.chartConfig)
                return;

            if (this.chartConfig.ChartLabels && typeof this.chartConfig.ChartLabels === 'object')
                this.chartLabels = Object.keys(this.chartConfig.ChartLabels).map(key => this.chartConfig.ChartLabels[key]);

            if (this.chartConfig.ChartValueMap && typeof this.chartConfig.ChartValueMap === 'object')
                this.chartFields = Object.keys(this.chartConfig.ChartValueMap).map(key => this.chartConfig.ChartValueMap[key]);
        }

        if (this.chartFields) {
            this.formControl.valueChanges.subscribe(val => {
                this.drawGraph(val);
            });

            this.drawGraph(this.field.value);
        }
    }

    drawGraph(val) {
        const newChartData = [];
        this.chartFields.forEach((key, index) => {
            let value = 0;
            if (val && val[key])
                value = val[key];

            if (newChartData[index] != null )
                newChartData[index] = value;
            else
                newChartData.push(value);

            if (value <= 0)
                this.noData = true;
        });
        if (!this.diffArrays(newChartData, this.chartData))
            this.chartData = [...newChartData];

        this.noData = false;
    }

    diffArrays(arr1: Array<string>, arr2: Array<string>) {
        if ((arr1 && !arr2) || (!arr1 && arr2))
            return false;

        if (arr1.length !== arr2.length)
            return false;
        for (let i = arr1.length; i--;) {
            if (arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }
}

export class ChartConfiguration {
    public ChartLabels: Array<string>;
    public ChartValueMap: Array<string>;
}



