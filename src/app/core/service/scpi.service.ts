import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScpiModel } from '../model/scpi.model';
import {ScpiSearch} from '@/core/model/scpi-search.model';

type Scpis = ScpiModel[];

@Injectable({
  providedIn: 'root',
})

export class ScpiService {
  private url = '/api/v1/scpi';

  constructor(private http: HttpClient) {}

  get(): Observable<Scpis> {
    return this.http.get<Scpis>(this.url);
  }

  getScpiWithFilter(search?:ScpiSearch): Observable<ScpiModel[]> {
    return this.http.post<ScpiModel[]>(`${this.url}/search`,search);
  }
}

