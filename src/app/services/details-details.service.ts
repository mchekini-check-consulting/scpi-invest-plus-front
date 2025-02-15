import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Details } from '../models/Details';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsDetailsService {
  http = inject(HttpClient);
  getDetailsScpi(scpid: number): Observable<Details> {
    return this.http.get<Details>(`/api/v1/scpi/details/${scpid}`);
  }
}
