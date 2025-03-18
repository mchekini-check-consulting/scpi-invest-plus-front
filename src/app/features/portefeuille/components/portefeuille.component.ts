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
  paginatedInvestissements: Investments[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

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
        this.totalPages = Math.ceil(this.investissements.length / this.itemsPerPage);
        this.updatePagination();

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedInvestissements = this.investissements.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }


  startInvesting(): void {
    this.router.navigate(["/scpi"]);
  }
}
