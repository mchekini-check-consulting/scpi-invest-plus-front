import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScpiIndexModel, ScpiModel } from '../model/scpi.model';
import { ScpiSearch } from '@/core/model/scpi.model';
import { Details } from '../model/Details';



type Scpis = ScpiModel[];
@Injectable({
  providedIn: "root",
})
export class ScpiService {
  [x: string]: any;
  private url = '/api/v1/scpi';
  private urlElasticsearch = '/api/v1/scpi';
  private investorUri = '/api/v1/investors';

  constructor(private http: HttpClient) {}




  get(): Observable<Scpis> {
    return this.http.get<Scpis>(this.url);
  }

  getScpiWithFilter(filters: ScpiSearch): Observable<ScpiIndexModel[]> {

   let params = new HttpParams();

    if (filters.name) {
      params = params.set("name", filters.name);
    }
    if (filters.distributionRate !== undefined) {
      params = params.set("distributionRate", filters.distributionRate.toString());
    }
    if (filters.minimumSubscription !== undefined) {
      params = params.set("minimumSubscription", filters.minimumSubscription.toString());
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

    return this.http.get<ScpiIndexModel[]>(`${this.urlElasticsearch}/search`, { params });
  }


  getScpiById(id: number | string): Observable<ScpiModel> {
    return this.http.get<ScpiModel>(`${this.url}/details/${id}`);
  }

  getScpisWithScheduledPayment(): Observable<ScpiIndexModel[]> {
    return this.http.get<ScpiIndexModel[]>(`${this.urlElasticsearch}/scheduled-payment`);
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
