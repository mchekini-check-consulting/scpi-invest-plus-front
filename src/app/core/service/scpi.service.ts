import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ScpiModel } from "../model/scpi.model";
import { ScpiSearch } from "@/core/model/scpi-search.model";
import { Details } from "../model/Details";

type Scpis = ScpiModel[];

@Injectable({
  providedIn: "root",
})
export class ScpiService {
  [x: string]: any;

  private url = "/api/v1/scpi";
  private investorUri = "/api/v1/investors";

  constructor(private http: HttpClient) {}

  get(): Observable<Scpis> {
    return this.http.get<Scpis>(this.url);
  }

  getScpiWithFilter(search?: ScpiSearch): Observable<ScpiModel[]> {
    return this.http.post<ScpiModel[]>(`${this.url}/search`, search);
  }

  getScpiById(id: number): Observable<Details> {
    return this.http.get<Details>(`${this.url}/details/${id}`);
  }

  getScpisWithScheduledPayment(): Observable<ScpiModel[]> {
    return this.http.get<ScpiModel[]>(`${this.url}/scheduled`);
  }

  verifyInvestmentAbility(): Observable<boolean> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.get<boolean>(`${this.investorUri}/InvestmentAbility`, {
      headers,
    });
  }
}
