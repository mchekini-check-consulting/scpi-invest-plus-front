import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ScpiService } from '../../core/service/explorer.service';
import { ScpiIndexModel } from '@/core/model/scpi.model';
import { ScpiScoreComponent } from '../../features/explorer/ScpiScoringResult/scpi.score.component'
interface Critere {
  nom: string;
  facteur: number;
  isValid: boolean;
}

export class CriteriaIn {
  name: string;
  factor: number;

  constructor(name: string, factor: number) {
    this.name = name;
    this.factor = factor;
  }
}

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [DropdownModule, ButtonModule, InputTextModule, TableModule, FormsModule, CommonModule, ScpiScoreComponent],
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css'],
})
export class ExplorerComponent implements OnInit {
  scpiResults: ScpiIndexModel[] = [];
  criteresDisponibles = [
    { label: 'Taux de rendement', value: 'distributionRate' },
    { label: 'Délais de jouissance', value: 'enjoymentDelay' },
    { label: 'Frais de gestion', value: 'managementCosts' },
    { label: 'Frais de souscription', value: 'subscriptionFeesBigDecimal' },
    { label: 'Capitalisation', value: 'capitalization' },
  ];
  criteres: Critere[] = [];

  constructor(private scpiService: ScpiService) {}

  ngOnInit(): void {
    const savedCriteres = localStorage.getItem('criteres');
    const savedResults = localStorage.getItem('scpiResults');

    if (savedCriteres) {
      this.criteres = JSON.parse(savedCriteres);
    } else {
      this.criteres = [
        { nom: '', facteur: 0, isValid: true },
        { nom: '', facteur: 0, isValid: true },
        { nom: '', facteur: 0, isValid: true },
        { nom: '', facteur: 0, isValid: true },
      ];
    }

    if (savedResults) {
      this.scpiResults = JSON.parse(savedResults);
    }
  }
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'ArrowUp', 'ArrowDown', 'Tab', 'Backspace', 'Delete', 
      'Home', 'End', 'Control', 'Meta', 'Shift'
    ];
    
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  
  ajouterCritere() {
    const criteresSelectionnes = this.criteres.map(c => c.nom).filter(nom => nom);
    const criteresDisponiblesRestants = this.criteresDisponibles.filter(critere => !criteresSelectionnes.includes(critere.value));
  
    if (criteresDisponiblesRestants.length > 0) {
      this.criteres.push({ nom: '', facteur: 1, isValid: true });
    } 
    }

  supprimerCritere(index: number) {
    this.criteres.splice(index, 1);
  }

  filtrerCritereDisponibles(nomCritere: string): { label: string; value: string }[] {
    const criteresSelectionnes = this.criteres.map(c => c.nom).filter(nom => nom && nom !== nomCritere);
    return this.criteresDisponibles.filter(critere => !criteresSelectionnes.includes(critere.value));
  }

  validerFormulaire() {
  const criteresRestants = this.criteresDisponibles.filter(cd =>
    !this.criteres.map(c => c.nom).includes(cd.value)
  );

  if (criteresRestants.length === 0) {
    return;
  }
    let isValid = true;
  
    this.criteres.forEach(critere => {
      if (!critere.nom || critere.facteur < 1 || critere.facteur > 10) {
        critere.isValid = false;
        isValid = false;
      } else {
        critere.isValid = true;
      }
    });
  
    if (isValid) {
      const criteriaList: CriteriaIn[] = this.criteres
        .filter(critere => critere.nom !== '')
        .map(critere => new CriteriaIn(critere.nom, critere.facteur));
  
      console.log("Critères envoyés :", criteriaList);
  
      localStorage.setItem('criteres', JSON.stringify(this.criteres));
  
      this.scpiResults = [];
      localStorage.removeItem('scpiResults');
  
      this.scpiService.sendCriteria(criteriaList).subscribe(
        (response: ScpiIndexModel[]) => {
          this.scpiResults = response;
          localStorage.setItem('scpiResults', JSON.stringify(this.scpiResults));
        },
        error => console.error('Erreur API:', error)
      );
    }
  }



  reinitialiserCriteres() {
    this.criteres = [
      { nom: '', facteur: 1, isValid: true },
      { nom: '', facteur: 1, isValid: true },
      { nom: '', facteur: 1, isValid: true },
      { nom: '', facteur: 1, isValid: true },
    ];
    this.scpiResults = [];
    localStorage.removeItem('criteres');
    localStorage.removeItem('scpiResults');
  }


}


function mapScpiData(scpiData: any[]): ScpiIndexModel[] {
  return scpiData.map(scpi => ({
    id: scpi.id,
    scpiId: scpi.scpiId ?? 0,
    name: scpi.name,
    distributionRate: scpi.distributionRate ?? 0,
    subscriptionFees: scpi.subscriptionFees ?? false,
    frequencyPayment: scpi.frequencyPayment ?? 'Annuel',
    countryDominant: {
      country: scpi.locations?.[0]?.nom ?? '',
      countryPercentage: scpi.locations?.[0]?.pourcentage ?? 0,
    },
    sectorDominant: {
      name: scpi.sectors?.[0]?.nom ?? '',
      sectorPercentage: scpi.sectors?.[0]?.pourcentage ?? 0,
    },
    sharePrice: scpi.sharePrice ?? 0,
    locations: scpi.locations?.map((location: any) => ({
      country: location.nom,
      countryPercentage: location.pourcentage,
    })) ?? [],
    sectors: scpi.sectors?.map((sector: any) => ({
      name: sector.nom,
      sectorPercentage: sector.pourcentage,
    })) ?? [],
    minimumSubscription: scpi.minimumSubscription ?? 0,
    capitalization: scpi.capitalization ?? 0,
    enjoymentDelay: scpi.enjoymentDelay ?? 0,
    managementCosts: scpi.managementCosts ?? 0,
    subscriptionFeesBigDecimal: scpi.subscriptionFeesBigDecimal ?? 0,
    matchedScore: scpi.matchedScore ?? 0,
  }));
}



