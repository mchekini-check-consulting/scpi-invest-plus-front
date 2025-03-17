import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ScpiModel } from '../model/scpi.model';
import { ScpiSearch } from '@/core/model/scpi-search.model';
import { Details } from '../model/Details';

type Scpis = ScpiModel[];

@Injectable({
  providedIn: 'root',
})
export class ScpiService {
  private url = '/api/v1/scpi';

  private scpisSubject = new BehaviorSubject<ScpiModel[]>([]);
  scpis$ = this.scpisSubject.asObservable();

  constructor(private http: HttpClient) {}

  get(): Observable<Scpis> {
    return this.http.get<Scpis>(this.url).pipe(tap(scpis=>{
      this.scpisSubject.next(scpis);
    }));
  }
  getScpiWithFilter(search?: ScpiSearch): Observable<ScpiModel[]> {
    return this.http.post<ScpiModel[]>(`${this.url}/search`, search);
  }

  getScpiById(id: number): Observable<Details> {
    return this.http.get<Details>(`${this.url}/details/${id}`);
  }
}
