import {Component, OnInit} from '@angular/core';
import {Details} from '@/core/model/Details';
import {DetailsDetailsService} from '@/core/service/details-details.service';
import {TableModule} from 'primeng/table';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {NgForOf} from '@angular/common';
import {Slider} from 'primeng/slider';

@Component({
  selector: 'app-comparator',
  imports: [
    TableModule,
    FormsModule,
    DropdownModule,
    NgForOf,
    Slider,
    ReactiveFormsModule
  ],
  templateUrl: './comparator.component.html',
  styleUrl: './comparator.component.css'
})
export class ComparatorComponent implements OnInit {


  allNames: { name: string }[] = [];
  filteredNames: { name: string }[][] = [[], [], []];
  selectedNames: ({ name: string } | null)[] = [null, null, null];
  scpiList: (Details | null)[] = [null, null, null];
  scpiResults: any[] = [];
  form!: FormGroup;
  investValue: number = 0;

  constructor(private detailsService: DetailsDetailsService,
              private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.ListNames();
    this.initScpiResults();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      investValue: [10000, [Validators.required, Validators.max(100000)]]
    });

    this.form.get('investValue')?.valueChanges.subscribe(val => {
      this.investValue = val;
      this.compareScpis();
    });
  }

  ListNames() {
    this.detailsService.getScpiNames().subscribe(
      (data: string[]) => {
        this.allNames = data.map(name => ({name}));
        this.updateFilteredNames();
      },
      (error) => {
        console.error("Erreur lors du chargement des noms des scpis :", error);
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


  onScpiSelected(selected: any, index: number) {

    const name = selected?.name ?? null;
    if (!name) {
      this.scpiList[index] = null;
      this.selectedNames[index] = null;
      this.compareScpis();
      this.updateFilteredNames();
      return;
    }


    if (
      this.selectedNames.some(
        (n, i) => n?.name === name && i !== index && n !== null
      )
    ) {
      console.warn(`La SCPI "${name}" est déjà utilisée dans une autre colonne.`);
      return;
    }

    this.selectedNames[index] = selected;

    this.detailsService.getDetailsByName(name).subscribe({
      next: (data: Details) => {
        this.scpiList[index] = data;
        this.compareScpis();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des détails :', err);
      }
    });
    this.updateFilteredNames();
  }

  compareScpis() {
    if (this.investValue > 100000) {
      this.investValue = 100000
      this.form.get('investValue')?.setValue(100000);
    }
    this.investValue = this.form.get('investValue')?.value;
    this.scpiResults = this.scpiList.map(scpi => scpi ? this.calculateResults(scpi) : this.initScpiResult());
  }

  calculateResults(scpi: Details): any {
    const lastStat = scpi.statYears?.length
      ? scpi.statYears.reduce((prev, current) =>
        prev?.yearStat?.yearStat > current?.yearStat?.yearStat ? prev : current)
      : null;
    const distributionRate = lastStat?.distributionRate ?? 0;
    return {
      revenusMensuels: ((this.investValue * (distributionRate / 100)) / 12).toFixed(2) + ' €',
      rendement: (distributionRate).toFixed(2),
      fraisSouscription: ((this.investValue * (scpi.subscriptionFees ?? 0) / 100)).toFixed(2) + ' €',
      cashback: ((this.investValue * (scpi.cashback ?? 0) / 100)).toFixed(2) + ' € économisés',
      capitalisation: scpi.capitalization !== undefined
        ? (scpi.capitalization / 1000000).toFixed(2) + ' M€'
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
      minimumInvest: '€',
    };
  }

  initScpiResults() {
    this.scpiResults = [this.initScpiResult(), this.initScpiResult(), this.initScpiResult()];
  }

  SetValueSlider(valText: number) {
    this.form.get('investValue')?.setValue(valText);
  }

  onInputChange() {
    const value = this.form.get('investValue')?.value;
    this.form.get('investValue')?.setValue(value, {emitEvent: false});
  }

  getMaxRevenueMensuelle() {
    return  this.scpiResults.map(scpi=> scpi.revenusMensuels).reduce((max, current) => {
      const currentValue = parseFloat(current.replace('€', '').replace('M€', ''));
      return currentValue > max ? currentValue : max;
    }, 0);
  }

  getMinRevenueMensuelle() {
    return this.scpiResults.map(scpi=> scpi.revenusMensuels).reduce((min, current) =>{
      const currentValuer = parseFloat(current.replace('€', '').replace('M€', ''));
      return currentValuer < min ? currentValuer : min;
    }, 1000000);
    
  }

  getColorValue(value: string | number | null) : string{
    
    if (!value) return 'black';
    const number = parseFloat(value.toString().replace('€', '').replace('M€', ''));
    if (isNaN(number)) return 'black';
    if( number <= 0) return 'black';
    if (number === this.getMaxRevenueMensuelle()) return 'green';
    else if (number < this.getMaxRevenueMensuelle() && number > this.getMinRevenueMensuelle()) return 'orange';
    else return 'red';
  }
}

