import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Dismemberment } from '../model/Dismemberment';

@Injectable({
  providedIn: 'root',
})
export class InvestorService {
  private apiUrl = `/api/v1/investors`;
  private dismembermentUrl = `/api/ref-dismemberment`;

  constructor(private http: HttpClient) {}

  getInvestorByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${email}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  createOrUpdateInvestor(email: string, investorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${email}`, investorData).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getDismembermentByType(propertyType: string): Observable<Dismemberment[]> {
    return this.http.get<Dismemberment[]>(
      `${this.dismembermentUrl}/${propertyType}`
    );
  }

  createInvestment(investmentData: any): Observable<any> {
    return this.http.post(`/api/v1/investment`, investmentData).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
