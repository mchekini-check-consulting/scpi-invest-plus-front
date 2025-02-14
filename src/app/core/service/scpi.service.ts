import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScpiModel } from '../model/scpi.model';

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
}
