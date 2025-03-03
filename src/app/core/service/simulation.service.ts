import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScpiSimulation, Simulation, SimulationName } from '../model/Simulation';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private apiUrl = '/api/v1/simulation';


  constructor(private http: HttpClient) {}

  getSimulations(): Observable<Simulation[]> {
    return this.http.get<Simulation[]>(this.apiUrl);
  }
  createSimulation(simulation: SimulationName): Observable<any> {
    return this.http.post(this.apiUrl, simulation);
  }

  addScpiToSimulation (scpi: ScpiSimulation): Observable<any> {
    return this.http.post(`${this.apiUrl}/addScpi`, scpi);
  }
}
