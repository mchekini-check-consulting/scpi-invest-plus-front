import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgStyle} from '@angular/common';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {Slider} from 'primeng/slider';
import {Details} from '@/core/model/Details';
import {DetailsDetailsService} from '@/core/service/details-details.service';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from "primeng/toast";
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-comparator',
    standalone: true,
    imports: [
        TableModule,
        FormsModule,
        DropdownModule,
        NgForOf,
        Slider,
        ReactiveFormsModule,
        DialogModule,
        NgStyle,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './comparator.component.html',
    styleUrls: ['./comparator.component.css']
})
export class ComparatorComponent implements OnInit {
    allNames: { name: string }[] = [];
    filteredNames: { name: string }[][] = [[], [], []];
    selectedNames: ({ name: string } | null)[] = [null, null, null];
    scpiList: (Details | null)[] = [null, null, null];
    scpiResults: any[] = [];
    form!: FormGroup;
    investValue: number = 10000;

    constructor(
        private detailsService: DetailsDetailsService,
        private fb: FormBuilder,
        private messageService: MessageService,
    ) {
    }

    ngOnInit() {
        this.loadFromLocalStorage();
        this.ListNames();
        this.initScpiResults();
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group({
            investValue: [this.investValue, [Validators.required, Validators.max(100000)]]
        });

        this.form.get('investValue')?.valueChanges.subscribe(val => {
            this.investValue = val;
            this.compareScpis();
            this.filterScpiOptions();
            this.saveToLocalStorage();
        });
    }

    loadFromLocalStorage() {
        const savedInvestValue = localStorage.getItem('investValue');
        if (savedInvestValue) {
            this.investValue = parseFloat(savedInvestValue);
        }

        const savedSelectedNames = localStorage.getItem('selectedNames');
        if (savedSelectedNames) {
            this.selectedNames = JSON.parse(savedSelectedNames);
        }

        const savedScpiList = localStorage.getItem('scpiList');
        if (savedScpiList) {
            this.scpiList = JSON.parse(savedScpiList);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('investValue', this.investValue.toString());
        localStorage.setItem('selectedNames', JSON.stringify(this.selectedNames));
        localStorage.setItem('scpiList', JSON.stringify(this.scpiList));
    }

    ListNames() {
        this.detailsService.getAllScpis().subscribe(
            (data: Details[]) => {
                this.allNames = data.map(scpi => ({
                    name: scpi.name,
                    minimumSubscription: scpi.minimumSubscription
                }));
                this.updateFilteredNames();
            },
            error => {
                console.error("Erreur lors du chargement des SCPI :", error);
            }
        );
    }


    updateFilteredNames() {
        this.filteredNames = this.selectedNames.map((selected, index) => {
            const otherScpi = this.selectedNames
                .filter((_, i) => i !== index)
                .map(s => s?.name);
            return this.allNames.filter(option => !otherScpi.includes(option.name));
        });
    }

    filterScpiOptions() {
        this.filteredNames = this.filteredNames.map((name) => {
            return name;
        });

        this.selectedNames.forEach((selected, index) => {
            const name = selected?.name ?? null;
            if (name) {
                const scpiDetails = this.scpiList.find(scpi => scpi?.name === name);
                if (scpiDetails && scpiDetails.minimumSubscription > this.investValue && this.investValue > 0) {
                    this.selectedNames[index] = null;
                    this.scpiList[index] = null;
                    this.showToast(selected);
                }
            }
        });

        this.compareScpis();
    }


    onScpiSelected(selected: any, index: number) {
        const name = selected?.name ?? null;
        if (!name) {
            this.scpiList[index] = null;
            this.selectedNames[index] = null;
            this.compareScpis();
            this.updateFilteredNames();
            this.saveToLocalStorage();
            return;
        }

        if (this.selectedNames.some((n, i) => n?.name === name && i !== index && n !== null)) {
            console.warn(`La SCPI "${name}" est déjà utilisée dans une autre colonne.`);
            return;
        }

        this.detailsService.getDetailsByName(name).subscribe({
            next: (data: Details) => {
                if (data.minimumSubscription > this.investValue) {
                    console.warn(
                        `SCPI "${name}" a une souscription minimum de ${data.minimumSubscription}€, ce qui est supérieur à ${this.investValue}€`
                    );
                    this.selectedNames[index] = null;
                    this.scpiList[index] = null;
                    this.compareScpis();
                    this.updateFilteredNames();
                    this.saveToLocalStorage();
                    this.showToast(selected);
                    return;
                }

                this.selectedNames[index] = selected;
                this.scpiList[index] = data;
                this.compareScpis();
                this.updateFilteredNames();
                this.saveToLocalStorage();
            },
            error: err => {
                console.error('Erreur lors de la récupération des détails :', err);
            }
        });
    }

    compareScpis() {
        if (this.investValue > 100000) {
            this.investValue = 100000;
            this.form.get('investValue')?.setValue(100000, {emitEvent: false});
        }

        this.scpiResults = this.scpiList.map(scpi =>
            scpi ? this.calculateResults(scpi) : this.initScpiResult()
        );
    }

    calculateResults(scpi: Details): any {
        const lastStat = scpi.statYears?.length
            ? scpi.statYears.reduce((prev, current) =>
                prev?.yearStat?.yearStat > current?.yearStat?.yearStat ? prev : current
            )
            : null;

        const distributionRate = lastStat?.distributionRate ?? 0;

        return {
            revenusMensuels: ((this.investValue * (distributionRate / 100)) / 12).toFixed(2) + ' €',
            rendement: distributionRate.toFixed(2),
            fraisSouscription: ((this.investValue * (scpi.subscriptionFees ?? 0) / 100)).toFixed(2) + ' €',
            cashback: ((this.investValue * (scpi.cashback ?? 0) / 100)).toFixed(2) + ' € économisés',
            capitalisation: scpi.capitalization !== undefined
                ? (scpi.capitalization / 1_000_000).toFixed(2) + ' M€'
                : '0 M€',
            frequenceLoyers: scpi.frequencyPayment ?? '-',
            delaiJouissance: scpi.enjoymentDelay !== undefined ? scpi.enjoymentDelay + ' Mois' : '-',
            minimumInvest: scpi.minimumSubscription !== undefined ? scpi.minimumSubscription + ' €' : '-'
        };
    }

    initScpiResult() {
        return {
            revenusMensuels: '€',
            rendement: '-',
            fraisSouscription: '€',
            cashback: '€ économisés',
            capitalisation: '0 M€',
            frequenceLoyers: '-',
            delaiJouissance: '-',
            minimumInvest: '€'
        };
    }

    initScpiResults() {
        this.scpiResults = [
            this.initScpiResult(),
            this.initScpiResult(),
            this.initScpiResult()
        ];
    }


    onInputChange() {
        const value = this.form.get('investValue')?.value;
        this.form.get('investValue')?.setValue(value, {emitEvent: false});
    }

    getMaxRevenueMensuelle() {
        return this.scpiResults
            .map(scpi => parseFloat(scpi.revenusMensuels.replace('€', '').replace(' M€', '')))
            .reduce((max, curr) => (curr > max ? curr : max), 0);
    }

    getMinRevenueMensuelle() {
        return this.scpiResults
            .map(scpi => parseFloat(scpi.revenusMensuels.replace('€', '').replace(' M€', '')))
            .reduce((min, curr) => (curr < min ? curr : min), 1_000_000);
    }

    getColorValue(value: string | number | null): string {
        if (!value) return 'black';
        const number = parseFloat(value.toString().replace('€', '').replace(' M€', ''));
        if (isNaN(number)) return 'black';
        if (number <= 0) return 'black';
        if (number === this.getMaxRevenueMensuelle()) return 'green';
        if (number > this.getMinRevenueMensuelle()) return 'orange';
        return 'red';
    }


    getItemStyle(scpi: any): any {
        return scpi.minimumSubscription >= this.investValue ? {color: 'gray', disabled: true} : {};
    }

    showToast(scpi: any) {
        if (scpi.minimumSubscription >= this.investValue) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Montant insuffisant',
                detail: `La SCPI "${scpi.name}" a été retirée car le montant minimum de souscription est ${scpi.minimumSubscription}€.`,
                life: 1000
            });
        }
    }


}
