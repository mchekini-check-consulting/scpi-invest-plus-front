import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ScpiModel } from '../model/scpi.model';

type Scpis = ScpiModel[];
const mockResults: ScpiModel[] = [
  { 
    id: 1, 
    name: 'SCPI Test', 
    minimumSubscription: 1000, 
    location: { 
      countryPercentage: 50, 
      id: { country: 'France', scpiId: 1 } 
    }, 
    sector: { 
      sectorPercentage: 30, 
      id: { name: 'Immobilier', scpiId: 1 } 
    }, 
    statYear: { 
      distributionRate: 4.5 
    } 
  }
];

@Injectable({
  providedIn: 'root',
})
export class ScpiService {
  private url = '/api/v1/scpi';
  constructor(private http: HttpClient) {}
  get(): Observable<Scpis> {
    console.log("requète émise");
    return of(mockResults); 
    
    //this.http.get<Scpis>(this.url);
  }
  search(query: string): Observable<Scpis> {
    return this.http.get<Scpis>(`${this.url}/search/?query=${query}`);
  }
}
