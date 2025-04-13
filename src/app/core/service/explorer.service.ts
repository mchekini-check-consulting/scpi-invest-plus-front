import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})


export class ScpiService {
  private apiUrl = "/api/v1/scpi/ScoreSearch";

  constructor(private http: HttpClient) {}

  sendCriteria(criteria: any): Observable<any> {
    return this.http.post(this.apiUrl, criteria);
  }

  
}
