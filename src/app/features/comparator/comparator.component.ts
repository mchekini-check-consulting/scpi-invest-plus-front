import {Component, OnInit} from '@angular/core';
import {Details} from '@/core/model/Details';
import {DetailsDetailsService} from '@/core/service/details-details.service';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {Slider} from 'primeng/slider';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {NgForOf, NgIf} from '@angular/common';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-comparator',
  imports: [
    TableModule,
    FormsModule,
    DropdownModule,
    Slider,
    Button,
    InputText,
    NgForOf,
    NgIf,
    Select
  ],
  templateUrl: './comparator.component.html',
  styleUrl: './comparator.component.css'
})
export class ComparatorComponent implements OnInit{
  investValue: number = 10000;
  scpiList: Details[] = [];
  selectedScpis: (Details | null)[] = [null, null, null];
  scpiResults: any[] = [];


  constructor(private detailsService: DetailsDetailsService) {}

  ngOnInit() {
    this.loadScpis();
    this.initScpiResults();
  }
  loadScpis() {
    this.detailsService.getAllScpis().subscribe({
      next: (data: Details[]) => {
        this.scpiList = data.map(scpi => ({
          ...scpi,
          subscriptionFees: scpi.subscriptionFees,
          cashback: scpi.cashback ,
          capitalization: scpi.capitalization,
          frequencyPayment: scpi.frequencyPayment,
          enjoymentDelay: scpi.enjoymentDelay
        }));
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des SCPI :', err);
      }
    });
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
      revenusMensuels: ((this.investValue * (distributionRate / 100)) / 12).toFixed(2) ,
      fraisSouscription: ((this.investValue * (scpi.subscriptionFees ?? 0) / 100)).toFixed(2) ,
      cashback: ((this.investValue * (scpi.cashback ?? 0) / 100)).toFixed(2) ,
      capitalisation: scpi.capitalization !== undefined ? scpi.capitalization : '-',
      frequenceLoyers: scpi.frequencyPayment ?? '-',
      delaiJouissance: scpi.enjoymentDelay !== undefined ? scpi.enjoymentDelay : '-'
    };
  }

  clearScpiSelection(index: number) {
    this.selectedScpis[index] = null;
    this.scpiResults[index] = this.initScpiResult();
  }

  initScpiResult() {
    return {
      revenusMensuels: '',
      fraisSouscription: '',
      cashback: '',
      capitalisation: '',
      frequenceLoyers: '',
      delaiJouissance: ''
    };
  }
  initScpiResults() {
    this.scpiResults = [this.initScpiResult(), this.initScpiResult(), this.initScpiResult()];
  }
  onScpiSelected(event: Details | null, index: number) {
    if (event) {
      this.selectedScpis[index] = { ...event };
    }
  }
}
