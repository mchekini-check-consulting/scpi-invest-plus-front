import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScpiModel } from '../model/scpi.model';
import { ScpiSearch } from '@/core/model/scpi.model';
import { Details } from '../model/Details';

type Scpis = ScpiModel[];

@Injectable({
  providedIn: "root",
})
export class ScpiService {
  [x: string]: any;
  private url = '/api/v1/scpi';
  private urlIndex = '/api/v1/scpiIndex';
  private investorUri = '/api/v1/investors';

  constructor(private http: HttpClient) {}

  get(): Observable<Scpis> {
    return this.http.get<Scpis>(this.url);
  }


  getScpiWithFilter(filters: ScpiSearch): Observable<ScpiModel[]> {

    console.log("test scpi search ___",filters);

    let params = new HttpParams();

    if (filters.name) {
      params = params.set("name", filters.name);
    }
    if (filters.minimumDistribution !== undefined) {
      params = params.set("minimumDistribution", filters.minimumDistribution.toString());
    }
    if (filters.minimumInvestmentAmount !== undefined) {
      params = params.set("minimumInvestmentAmount", filters.minimumInvestmentAmount.toString());
    }
    if (filters.subscriptionFees !== undefined) {
      params = params.set("subscriptionFees", filters.subscriptionFees.toString());
    }
    if (filters.frequencyPayment) {
      params = params.set("frequencyPayment", filters.frequencyPayment);
    }
    if (filters.locations?.length) {
      filters.locations.forEach(location => {
        params = params.append("locations", location);
      });
    }
    if (filters.sectors?.length) {
      filters.sectors.forEach(sector => {
        params = params.append("sectors", sector);
      });
    }

    return this.http.get<ScpiModel[]>(`${this.urlIndex}/search`, { params });
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
