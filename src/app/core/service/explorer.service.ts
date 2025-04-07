import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})


export class ScpiService {
  private apiUrl = 'http://localhost:8082/api/scpi/search';

  constructor(private http: HttpClient) {}

  sendCriteria(criteria: any): Observable<any> {
    console.log("### Les critères envoyés au backend : ", criteria);
  
    criteria.forEach((crit: any, index: number) => {
      console.log(`Critère ${index + 1} - Nom: ${crit.name}, Facteur: ${crit.factor}`);
    });    return this.http.post(this.apiUrl, criteria);
  }
}
