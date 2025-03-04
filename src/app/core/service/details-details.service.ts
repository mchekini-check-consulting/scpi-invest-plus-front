import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Details} from '../model/Details';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsDetailsService {
  http = inject(HttpClient);

  getDetailsScpi(scpid: number): Observable<Details> {
    return this.http.get<Details>(`/api/v1/scpi/details/${scpid}`);
  }
  getAllScpis(): Observable<Details[]> {
    return this.http.get<Details[]>(`/api/v1/scpi/details`);
  }

  getLastStats(details: Details) {
    return details.statYears && details.statYears.length > 0
      ? details.statYears.reduce((prev, current) =>
        prev.yearStat.yearStat > current.yearStat.yearStat
          ? prev
          : current
      )
      : null;
  }

  getMaxSectorLastYear(details: Details) {
    return details.sectors && details.sectors.length > 0
      ? details.sectors.reduce((prev, current) =>
        prev.sectorPercentage > current.sectorPercentage
          ? prev
          : current
      )
      : null
  }
}
