import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ScpiModel } from '../../../../core/model/scpi.model';
import { ScpiService } from '../../../../core/service/scpi.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, InputTextModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() searchResultsChanged = new EventEmitter<ScpiModel[]>(); // Ajout de l'événement
  searchTerm: string = '';
  searchResults: ScpiModel[] = [];
  private searchSubject = new Subject<string>();

  private http = inject(HttpClient);
  private scpiService = inject(ScpiService); 

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(500),  
        distinctUntilChanged()  
      )
      .subscribe(term => this.fetchResults(term)); 
  }
  

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  fetchResults(query: string) {
    if (!query.trim()) {
      this.handleEmptySearch();
      return;
    }
  
    this.scpiService.search(query).subscribe(results => {
      this.searchResults = results; // Mise à jour des résultats de recherche
      this.searchResultsChanged.emit(results); // Notifier ScpiComponent
    });
  }

  handleEmptySearch() {
    this.scpiService.get().subscribe(
      (scpis) => {
        this.searchResults = scpis;
        this.searchResultsChanged.emit(scpis); // Notifier ScpiComponent avec toutes les SCPI
      }
    );
  }
}
