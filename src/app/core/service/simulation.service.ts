import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, switchMap, tap} from 'rxjs';
import {ScpiSimulation, Simulation, SimulationName} from '../model/Simulation';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private apiUrl = '/api/v1/simulation';
  private simulationSubject = new BehaviorSubject<Simulation | null>(null);
  simulation$ = this.simulationSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  getSimulations(): Observable<Simulation[]> {
    return this.http.get<Simulation[]>(this.apiUrl);
  }

  createSimulation(simulation: SimulationName): Observable<any> {
    return this.http.post(this.apiUrl, simulation);
  }

  getSimulationById(id: string | number): Observable<Simulation> {
    return this.http.get<Simulation>(this.apiUrl + "/" + id).pipe(tap<Simulation>(simulation => {
      this.simulationSubject.next(simulation)
    }));
  }

  addScpiToSimulation(scpi: ScpiSimulation): Observable<any> {
    return this.http.post(`${this.apiUrl}/addScpi`, scpi)
      .pipe(switchMap(() => this.getSimulationById(scpi.simulationId)));
  }
}
