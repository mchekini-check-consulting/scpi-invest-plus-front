import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, throwError } from 'rxjs';
import { Investments } from '../model/Investments';

@Injectable({
    providedIn: 'root'
  })
export class InvestmentService{
    private apiUrl = "/api/v1/investment"

    constructor(private http: HttpClient){}

    public getInvestments():Observable<Investments[]>{
        return this.http.get<Investments[]>(this.apiUrl).pipe(
            catchError(()=>{
                return of([])
            })
        )
    }
}