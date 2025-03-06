import {Component, OnInit} from '@angular/core';
import {Details} from '@/core/model/Details';
import {DetailsDetailsService} from '@/core/service/details-details.service';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
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
    Slider
  ],
  templateUrl: './comparator.component.html',
  styleUrl: './comparator.component.css'
})
export class ComparatorComponent implements OnInit{
  investValue: number = 10000;
  scpiList: Details[] = [];
  selectedScpis: (Details | null)[] = [null, null, null];
  filteredScpis: Details[][] = [[], [], []];
  scpiResults: any[] = [];

  constructor(private detailsService: DetailsDetailsService) {}

  ngOnInit() {
    this.loadScpis();
    this.initScpiResults();
  }

  loadScpis() {
    this.detailsService.getAllScpis().subscribe({
      next: (data: Details[]) => {
        this.scpiList = data.sort((a, b)=>a.name.localeCompare(b.name));
        this.filteredScpis = [data, data, data];
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des SCPI :', err);
      }
    });
  }
  onScpiSelected(scpi: Details | null, index: number) {
    console.log(`Sélection de la SCPI "${scpi?.name}" à l'index ${index}`);

    if (scpi && this.selectedScpis.some((s, i) => s?.name === scpi.name && i !== index)) {
      console.warn(`La SCPI "${scpi.name}" est déjà utilisée dans une autre colonne.`);
      return;
    }

    this.selectedScpis[index] = scpi ? { ...scpi } : null;
    this.updateScpiOptions();
    this.compareScpis();
    console.log("État mis à jour de selectedScpis:", this.selectedScpis);
  }

  updateScpiOptions() {
    const selectedNames = this.selectedScpis
      .filter(scpi => scpi !== null)
      .map(scpi => scpi!.name);

    this.filteredScpis = this.selectedScpis.map((_, i) =>
      this.scpiList
        .filter(scpi => !selectedNames.includes(scpi.name) || this.selectedScpis[i]?.name === scpi.name)

    );
  }
  compareScpis() {
    this.scpiResults = this.selectedScpis.map(scpi => scpi ? this.calculateResults(scpi) : this.initScpiResult());
  }
  calculateResults(scpi: Details): any {
    if (!scpi) return this.initScpiResult();

    const lastStat = scpi.statYears?.length
      ? scpi.statYears.reduce((prev, current) =>
        prev?.yearStat?.yearStat > current?.yearStat?.yearStat ? prev : current)
      : null;
    const distributionRate = lastStat?.distributionRate ?? 0;
    return {
      revenusMensuels: ((this.investValue * (distributionRate / 100)) / 12).toFixed(2) + ' €',
      rendement: (distributionRate).toFixed(2) ,
      fraisSouscription: ((this.investValue * (scpi.subscriptionFees ?? 0) / 100)).toFixed(2) + ' €',
      cashback: ((this.investValue * (scpi.cashback ?? 0) / 100)).toFixed(2) + ' € économisés',
      capitalisation: scpi.capitalization !== undefined
        ? (scpi.capitalization / 1000000).toFixed(2) + ' M€'
        : '0 M€',
      frequenceLoyers: scpi.frequencyPayment ?? '-',
      delaiJouissance: scpi.enjoymentDelay !== undefined ? scpi.enjoymentDelay + ' Mois': '-',
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
}

