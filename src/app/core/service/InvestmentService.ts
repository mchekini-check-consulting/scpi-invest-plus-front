import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, throwError } from "rxjs";
import { InvestmentStatistics } from "../model/Investments";
import { InvestmentState } from "../model/Investments";
@Injectable({
  providedIn: "root",
})
export class InvestmentService {
  private apiUrl = "/api/v1/investment";
  private apiUrlStat = "/api/v1/investment";

  constructor(private http: HttpClient) {}

  public getStatisticsInvestments(): Observable<InvestmentStatistics> {
    return this.http.get<InvestmentStatistics>(`${this.apiUrlStat}/stats`).pipe(
      catchError((error) => {
        console.error(
          "Erreur lors de la récupération des statistiques :",
          error
        );
        return of({
          montantInvesti: 0,
          rendementMoyen: 0,
          revenuMensuel: 0,
          cashbackMontant: 0,
        });
      })
    );
  }

  public getPageableInvestments(
    page: number,
    size: number,
    state: string
  ): Observable<InvestmentState> {
    return this.http
      .get<InvestmentState>(
        `${this.apiUrl}?page=${page}&size=${size}&state=${state}`
      )
      .pipe(
        catchError((error) => {
          console.error(
            "Erreur lors de la récupération des investissements :",
            error
          );
          return of({
            totalInvesti: 0,
            investments: { content: [], totalElements: 0 },
          });
        })
      );
  }
}
