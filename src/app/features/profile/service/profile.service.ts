import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `/api/investors`;

  constructor(private http: HttpClient) {}

  // Récupérer un investisseur par email
  getInvestorByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${email}`);
  }

  // Mettre à jour un investisseur
  updateInvestor(email: string, investorData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${email}`, investorData);
  }
}
