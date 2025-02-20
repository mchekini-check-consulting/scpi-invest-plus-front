import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvestorService {
  private apiUrl = `/api/v1/investors`;

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
}
