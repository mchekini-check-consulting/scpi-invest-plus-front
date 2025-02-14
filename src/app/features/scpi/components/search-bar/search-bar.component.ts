import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ScpiModel } from '../../../../core/models/scpi.model';
import { ScpiService } from '../../../../core/services/scpi.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, InputTextModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  searchTerm: string = '';
  searchResults: ScpiModel[] = [];
  private searchSubject = new Subject<string>();

  private http = inject(HttpClient);
  private scpiService = inject(ScpiService); // Injection du service SCPI

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(500),  // Attente de 500ms après la dernière frappe
        distinctUntilChanged()  // N'émettre que si la valeur change
      )
      .subscribe(term => this.fetchResults(term)); // Appel de la fonction fetchResults()
  }
  

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  fetchResults(query: string) {
    if (!query.trim()) {
        this.handleEmptySearch();
      return;
    }

    this.http.get<ScpiModel[]>(`https://localhost:8081/api/v1/scpi/search/?query=${query}`)
      .subscribe(
        (response) => {
          this.searchResults = response, 
          this.scpiService.updateScpis(response); // Mettre à jour le service et notifier les abonnés
        },
        (error) => {
          this.searchResults = [];
          this.scpiService.updateScpis([]); // Réinitialiser la liste si erreur
        }
      );
  }

  // Fonction exécutée quand l'input est vide
  handleEmptySearch() {
 
    this.scpiService.get().subscribe(
      (scpis) => {
        console.log('SCPI récupérées :', scpis);
      },
      (error) => {
        console.error('Erreur lors de la récupération des SCPI', error);
      }
    );
  }
}
