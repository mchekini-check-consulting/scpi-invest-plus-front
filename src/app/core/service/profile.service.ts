import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
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
}
