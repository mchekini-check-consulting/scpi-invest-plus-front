import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvestorService {
  private apiUrl = `/api/v1/investors`;

  constructor(private http: HttpClient) {}

  getInvestorByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${email}`);
  }

  updateInvestor(email: string, investorData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${email}`, investorData);
  }

  createInvestor(investorData: any): Observable<any> {
    return this.http.post(this.apiUrl, investorData);
  }

  createOrUpdateInvestor(email: string, investorData: any): Observable<any> {
    return this.getInvestorByEmail(email).pipe(
      switchMap((existingInvestor) => {
        if (existingInvestor) {
          return this.updateInvestor(email, investorData);
        } else {
          return this.createInvestor({ email, ...investorData });
        }
      }),
      catchError((error) => {
        if (error.status === 404) {
          return this.createInvestor({ email, ...investorData });
        }
        return throwError(() => error);
      })
    );
  }

}
