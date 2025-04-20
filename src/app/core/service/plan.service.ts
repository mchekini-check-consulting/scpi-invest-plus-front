import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, ReplaySubject, tap } from "rxjs";
import { PlanModel } from "@/core/model/plan.model";

@Injectable({
  providedIn: "root",
})
export class PlanService {
  public plansSubject = new ReplaySubject<PlanModel[]>();
  public plans$ = this.plansSubject.asObservable();

  constructor(private http: HttpClient) {}

  getPlans(): Observable<PlanModel[]> {
    return this.http.get<PlanModel[]>("api/v1/plans").pipe(
      tap((data: PlanModel[]) => {
        this.plansSubject.next(data);
      })
    );
  }

  sendPlan(currentPlan: String, newPlan: String): Observable<any> {
    return this.http.put<any>(
      `api/v1/investors?currentRole=${encodeURIComponent(currentPlan.toString())}&newRole=${encodeURIComponent(newPlan.toString())}`,
      {}
    );
  }
}
