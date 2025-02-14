import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { ScpiModel } from '../models/scpi.model';

type Scpis = ScpiModel[];

@Injectable({
  providedIn: 'root',
})
export class ScpiService {
  private url = '/api/v1/scpi';
  public _scpis: ReplaySubject<Scpis> = new ReplaySubject<Scpis>(1);
  constructor(private http: HttpClient) {}

  get scpi$(): Observable<Scpis> {
    return this._scpis.asObservable();
  }

  get(): Observable<Scpis> {
    return this.http.get<Scpis>(this.url).pipe(
      tap((scpis: Scpis) => {
        this._scpis.next(scpis);
      })
    );
  }

   /** Met à jour la liste des SCPI et notifie les abonnés */
   updateScpis(newScpis: Scpis): void {
    this._scpis.next(newScpis); 
  }
}