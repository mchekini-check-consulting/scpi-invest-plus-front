import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { InvestorService } from '@/core/service/investor.service';
import { Dismemberment } from '@/core/model/Dismemberment';

@Component({
  selector: 'app-year-picker-calendar',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, PaginatorModule],
  templateUrl: './year-picker-calendar.component.html',
  styleUrls: ['./year-picker-calendar.component.css'],
})
export class YearPickerCalendarComponent implements OnInit {
  @Output() yearSelected = new EventEmitter<{
    year: number;
    percentage: number;
  }>();

  @Input() selectedPropertyType = '';

  selectedYear?: { year: number; percentage: number };
  currentPage = 0;
  itemsPerPage = 3;
  activeTab: string = 'vue';

  yearOptions: { year: number; percentage: number }[] = [];
  filteredYearOptions: { year: number; percentage: number }[] = [];
  paginatedYearOptions: { year: number; percentage: number }[] = [];

  constructor(private investorService: InvestorService) {}

  ngOnInit() {
    this.loadDismembermentData();
  }

  ngOnChanges(changes: any) {
    if (
      changes['selectedPropertyType'] &&
      changes['selectedPropertyType'].currentValue
    ) {
      // console.log(
      //   'selectedPropertyType a changé :',
      //   changes['selectedPropertyType'].currentValue
      // );
      this.loadDismembermentData();
    }
  }

  selectYear(option: { year: number; percentage: number }) {
    this.selectedYear = option;
    this.yearSelected.emit(option);
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.updatePaginatedOptions();
  }

  filterYears(event: any) {
    const query = event.filter?.toLowerCase() || '';
    this.filteredYearOptions = this.yearOptions.filter(
      (option) =>
        option.year.toString().includes(query) ||
        option.percentage.toString().includes(query)
    );
    this.currentPage = 0;
    this.updatePaginatedOptions();
  }

  updatePaginatedOptions() {
    const start = this.currentPage * this.itemsPerPage;
    this.paginatedYearOptions = this.filteredYearOptions.slice(
      start,
      start + this.itemsPerPage
    );
  }

  loadDismembermentData() {
    if (!this.selectedPropertyType) {
      return;
    }

    // console.log('test setlected', this.selectedPropertyType);
    this.investorService
      .getDismembermentByType(this.selectedPropertyType)
      .subscribe({
        next: (data: Dismemberment[]) => {
          if (data && data.length > 0) {
            this.yearOptions = data.map((item) => ({
              year: item.yearDismemberment,
              percentage: item.rateDismemberment,
              label: `${item.yearDismemberment} ans - ${item.rateDismemberment}%`,
            }));
            this.filteredYearOptions = [...this.yearOptions];
            this.updatePaginatedOptions();
          } else {
            console.warn(
              'Aucune donnée reçue pour le type de propriété :',
              this.selectedPropertyType
            );
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des données :', err);
        },
      });
  }
}
