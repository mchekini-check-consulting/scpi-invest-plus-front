import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ScpiService } from '../../core/service/explorer.service';  
import { ScpiIndexModel } from '@/core/model/scpi.model';
import { ScpiComponent } from '../../features/scpi/scpi.component';

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
  selector: 'app-root',
  standalone: true,
  imports: [DropdownModule, ButtonModule, InputTextModule, TableModule, FormsModule, CommonModule, ScpiComponent],
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css'],
})
export class ExplorerComponent implements OnInit {
  scpiResults: ScpiIndexModel[] = [];
  criteresDisponibles = [
    { label: 'Taux de rendement', value: 'distributionRate' },
    { label: 'Délais de jouissance', value: 'enjoymentDelay' },
    { label: 'Frais de gestion', value: 'managementCosts' },
    { label: 'Frais de souscription', value: 'subscriptionFees' },
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

  ajouterCritere() {
    this.criteres.push({ nom: '', facteur: 1, isValid: true });
  }

  supprimerCritere(index: number) {
    this.criteres.splice(index, 1);
  }

  filtrerCritereDisponibles(nomCritere: string): { label: string; value: string }[] {
    const criteresSelectionnes = this.criteres.map(c => c.nom).filter(nom => nom && nom !== nomCritere);
    return this.criteresDisponibles.filter(critere => !criteresSelectionnes.includes(critere.value));
  }

  validerFormulaire() {
    let isValid = true;

    this.criteres.forEach(critere => {
      if (!critere.nom || critere.facteur <= 0) {
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

      this.scpiService.sendCriteria(criteriaList).subscribe(
        (response: ScpiIndexModel[]) => {
          console.log('SCPI reçues:', response);
          this.scpiResults = mapScpiData(response);

          // 💾 Sauvegarde des résultats dans le localStorage
          localStorage.setItem('scpiResults', JSON.stringify(this.scpiResults));
        },
        error => console.error('Erreur API:', error)
      );
    }
  }

  reinitialiserCriteres() {
    this.criteres = [
      { nom: '', facteur: 0, isValid: true },
      { nom: '', facteur: 0, isValid: true },
      { nom: '', facteur: 0, isValid: true },
      { nom: '', facteur: 0, isValid: true },
    ];

  }
}


function mapScpiData(scpiData: any[]): ScpiIndexModel[] {
  return scpiData.map(scpi => ({
    id: scpi.id,
    name: scpi.name,
    distributionRate: scpi.distributionRate ?? 0,
    subscriptionFees: scpi.subscriptionFees ?? false,
    frequencyPayment: scpi.frequencyPayment ?? 'Annuel',
    countryDominant: {
      country: scpi.locations?.length ? scpi.locations[0].nom : '',
      countryPercentage: scpi.locations?.length ? scpi.locations[0].pourcentage : 0,
    },
    dominantSector: {
      name: scpi.sectors?.length ? scpi.sectors[0].nom : '',
      sectorPercentage: scpi.sectors?.length ? scpi.sectors[0].pourcentage : 0,
    },
    locations: scpi.locations?.map((location: { nom: string, pourcentage: number }) => ({
      country: location.nom,
      countryPercentage: location.pourcentage
    })) || [],
    sectors: scpi.sectors?.map((sector: { nom: string, pourcentage: number }) => ({
      name: sector.nom,
      sectorPercentage: sector.pourcentage
    })) || [],
    minimumSubscription: scpi.minimumSubscription ?? 0,
    mashedScore: scpi.mashedScore ?? 0,
    capitalization: scpi.capitalization ?? 0,
    enjoymentDelay: scpi.enjoymentDelay ?? 0,
    managementCosts: scpi.managementCosts ?? 0,
    subscriptionFeesBigDecimal: scpi.subscriptionFeesBigDecimal ?? 0,
  }));
}


