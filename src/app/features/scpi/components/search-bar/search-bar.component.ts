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
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
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
    const url = `https://localhost:8081/api/v1/scpi/search/?query=${query}`;

    this.http.get<ScpiModel[]>(url).subscribe(results => {
      this.searchResults = results;
      this.scpiService.updateScpis(results);
    });
  }

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
