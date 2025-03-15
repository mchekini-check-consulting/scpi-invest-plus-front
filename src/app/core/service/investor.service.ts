import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
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
    return this.getInvestorByEmail(email).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return this.http.post(`${this.apiUrl}`, investorData).pipe(
            catchError((postError) => {
              return throwError(() => postError);
            })
          );
        }
     
        return throwError(() => error);
      }),
      switchMap((investor) => {
        // Si l'investisseur existe, on effectue un PATCH pour le mettre à jour
        return this.http.patch(`${this.apiUrl}/${email}`, investorData).pipe(
          catchError((patchError) => {
            return throwError(() => patchError);
          })
        );
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
