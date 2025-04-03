import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, throwError } from "rxjs";
import { Investments } from "../model/Investments";

@Injectable({
  providedIn: "root",
})
export class InvestmentService {
  private apiUrl = "/api/v1/investment";
  private apiUrlPage = "/api/v1/investment/page";


  constructor(private http: HttpClient) {}

  public getPageableInvestments(
    page: number,
    size: number,
    state: string
  ): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrlPage}?page=${page}&size=${size}&state=${state}`)
      .pipe(
        catchError(() => {
          return of({ content: [], totalElements: 0 });
        })
      );
  }

  public getInvestments(state: string): Observable<Investments[]> {
    return this.http.get<Investments[]>(`${this.apiUrl}?state=${state}`).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }
  
}
