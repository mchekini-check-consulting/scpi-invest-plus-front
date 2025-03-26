import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { Dismemberment } from "../model/Dismemberment";
import {Investor} from '@/core/model/investor.model';

@Injectable({
  providedIn: "root",
})
export class InvestorService {
  private apiUrl = `/api/v1/investors`;
  private dismembermentUrl = `/api/ref-dismemberment`;

  constructor(private http: HttpClient) {}

  getInvestorByEmail(email: string): Observable<Investor> {
    return this.http.get<Investor>(`${this.apiUrl}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  createOrUpdateInvestor(email: string, investorData: any): Observable<any> {
    return this.getInvestorByEmail(email).pipe(
      catchError((error: HttpErrorResponse) =>
        error.status === 404
          ? this.http.post(`${this.apiUrl}`, investorData)
          : throwError(() => error)
      ),
      switchMap(() => this.http.patch(`${this.apiUrl}`, investorData)),
      catchError((error) => throwError(() => error))
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
