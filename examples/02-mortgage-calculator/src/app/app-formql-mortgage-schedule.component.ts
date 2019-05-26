import { Component, Input, forwardRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { FormValidator, FormComponent } from '@formql/core';

@Component({
    selector: 'app-mortgage-schedule',
    template: `<div id="chart-container" style="margin: 0px auto; width: 500px">
                    <canvas *ngIf="chartData && !noData"  baseChart
                        [datasets]="lineChartData"
                        [labels]="lineChartLabels"
                        [options]="lineChartOptions"
                        [legend]="true"
                        [chartType]="'line'"
                        >
                </canvas>
                </div>
                <div *ngIf="noData">No Data</div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AppFormQLMortgageScheduleComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => AppFormQLMortgageScheduleComponent),
            multi: true
        }]
})
export class AppFormQLMortgageScheduleComponent implements OnInit, ControlValueAccessor {
    static componentName = 'AppFormQLMortgageScheduleComponent';
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

    public chartConfig: ChartConfiguration;
    public chartData: any;
    public noData = true;
    public lineChartData: Array<LineChartData>;
    public lineChartLabels: Array<any>;
    public lineChartOptions: any = {
        responsive: true
    };

    public mortgageAmountField: string;
    public mortgageInterestRateField: string;
    public mortgagePeriodField: string;

    private _value: string;

    constructor() {

    }

    ngOnInit() {
        if (this.field && this.field.configuration) {
            this.chartConfig = <ChartConfiguration>this.field.configuration;

            if (this.chartConfig && this.chartConfig.ChartValueMap) {
                this.mortgageAmountField = this.chartConfig.ChartValueMap[0];
                this.mortgageInterestRateField = this.chartConfig.ChartValueMap[1];
                this.mortgagePeriodField = this.chartConfig.ChartValueMap[2];

                this.formControl.valueChanges.subscribe(val => {
                    this.drawGraph(val);
                });
                this.drawGraph(this.field.value);
            }
        }
    }

    drawGraph(val) {
        this.chartData = [];

        let mortgageAmount, mortgageInterestRate, mortgagePeriod = null;

        if (val) {
            if (val[this.mortgageAmountField])
                mortgageAmount = val[this.mortgageAmountField];

            if (val[this.mortgageInterestRateField])
                mortgageInterestRate = val[this.mortgageInterestRateField];

            if (val[this.mortgagePeriodField])
                mortgagePeriod = val[this.mortgagePeriodField];
        }

        if (mortgageAmount != null && mortgageInterestRate != null && mortgagePeriod != null && mortgagePeriod < 100) {
            this.paymentSchedule(mortgageAmount, mortgageInterestRate, mortgagePeriod);
            this.noData = false;
        } else
            this.noData = true;
    }

    get value(): any {

        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }

    writeValue(value: string): void {
        if (value)
            this._value = value;
    }

    registerOnChange(fn: any): void {}

    registerOnTouched(fn: any): void { }

    paymentSchedule(principal, interest, termInYears) {


        if (this.lineChartLabels == null || (this.lineChartLabels && this.lineChartLabels.length !== termInYears)) {
            this.lineChartLabels = [];
            for (let t = 0; t < termInYears; t++)
                this.lineChartLabels.push(t.toString());
        }

        this.lineChartData = [
            { data: new Array<number>(), label: 'Payment' },
            { data: new Array<number>(), label: 'Interest' },
            { data: new Array<number>(), label: 'Balance' },
        ];

        const payments = [];

        let yearCurrent = 0;

        let principalRemaining = principal;

        const interestRatePerYear = interest / 100;

        const denominator = Math.pow(1 + interestRatePerYear, termInYears) - 1;

        const amountPerPayment = Math.round
            (
                principalRemaining
                *
                (
                    interestRatePerYear / denominator + interestRatePerYear
                )
            );


        for (let t = 0; t < termInYears; t++) {
            const interestThisPayment = Math.round
                (
                    principalRemaining * interestRatePerYear
                );

            let principalThisPayment = amountPerPayment - interestThisPayment;

            if (principalThisPayment > principalRemaining) {
                principalThisPayment = principalRemaining;
            }

            principalRemaining -= principalThisPayment;

            const payment = new Payment();

            let acumulatedPrincipal = 0;
            let acumulatedInterest = 0;

            if (payments.length === 0) {
                acumulatedPrincipal = principalThisPayment;
                acumulatedInterest = acumulatedInterest;
                payment.Principal = principalThisPayment;
                payment.Interest = interestThisPayment;
                payment.Year = yearCurrent;
                payment.Balance = principalRemaining;
            } else {
                acumulatedPrincipal = principalThisPayment + payments[t - 1].Principal;;
                acumulatedInterest = acumulatedInterest + payments[t - 1].Interest;
                payment.Principal = principalThisPayment + payments[t - 1].Principal;
                payment.Interest = interestThisPayment + payments[t - 1].Interest;
                payment.Principal = principalThisPayment + payments[t - 1].Principal;
            }


            this.lineChartData[0].data.push(acumulatedPrincipal);
            this.lineChartData[1].data.push(acumulatedInterest);
            this.lineChartData[2].data.push(principalRemaining);


            payments.push(payment);

            yearCurrent++;

            if (principalRemaining <= 0) {
                break;
            }
        }
    }
}

export class ChartConfiguration {
    public ChartLabels: Array<string>;
    public ChartValueMap: Array<string>;
}

export class Payment {
    public Principal: number;
    public Interest: number;
    public Year: number;
    public Balance: number;
}

export class LineChartData {
    public data: Array<number>;
    public label: string;
}
