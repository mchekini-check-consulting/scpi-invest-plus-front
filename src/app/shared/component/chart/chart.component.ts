import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  imports: [ChartModule, CommonModule],
})
export class ChartComponent implements OnInit {
  @Input() chartData: any;
  @Input() chartOptions: any;
  @Input() chartHeight: string = '';
  @Input() chartWidth: string = '';
  constructor() {}

  ngOnInit(): void {}
}
