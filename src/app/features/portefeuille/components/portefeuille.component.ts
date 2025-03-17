import { Investments } from "@/core/model/Investments";
import { InvestmentService } from "@/core/service/InvestmentService";
import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-portefeuille",
  imports: [ButtonModule, CommonModule],
  templateUrl: "./portefeuille.component.html",
  styleUrl: "./portefeuille.component.css",
})
export class PortefeuilleComponent implements OnInit {
  investissements: Investments[] = [];

  constructor(
    private investmentService: InvestmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getInvestments();
  }

  public getInvestments(): void {
    this.investmentService.getInvestments().subscribe(
      (response: Investments[]) => {
        this.investissements = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  startInvesting(): void {
    this.router.navigate(["/scpi"]);
  }
}
