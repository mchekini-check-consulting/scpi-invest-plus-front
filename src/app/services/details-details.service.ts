import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Details } from '../models/class/Details';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsDetailsService {
  http = inject(HttpClient);
  getDetailsScpi(scpid:number): Observable<Details>{
    console.log("the id = ", scpid);
    return this.http.get<Details>(`http://localhost:8080/api/v1/application/Scpi/details/${scpid}`);
  }
}
