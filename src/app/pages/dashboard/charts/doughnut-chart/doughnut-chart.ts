import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doughnut-chart.html',
  styleUrls: ['./doughnut-chart.scss'],
})
export class DoughnutChart implements OnInit, AfterViewInit, OnChanges {
  @Input() departments: any[] = [];
  @Output() departmentClick = new EventEmitter<any>();

  charts: Chart[] = [];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Ensure DOM is fully ready
    setTimeout(() => this.renderCharts(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departments'] && !changes['departments'].firstChange) {
      this.destroyAllCharts();

      // Wait for Angular to render new canvas elements
      setTimeout(() => this.renderCharts(), 0);
    }
  }

  // ------------------------
  // ICONS & CLASSES
  // ------------------------
  getDepartmentIcon(name: string): string {
    const lower = name.toLowerCase();

    if (lower.includes('elementary')) return 'fa-solid fa-book-open';
    if (lower.includes('junior')) return 'fa-solid fa-graduation-cap';
    if (lower.includes('senior')) return 'fa-solid fa-user-tie';
    if (lower.includes('college')) return 'fa-solid fa-university';
    if (lower.includes('ict')) return 'fa-solid fa-computer';

    return 'fa-solid fa-school';
  }

  getDepartmentClass(deptName: string): string {
    switch (deptName.toLowerCase()) {
      case 'kinder': return 'kinder';
      case 'elementary': return 'elementary';
      case 'junior high school': return 'junior';
      case 'senior high school': return 'senior';
      case 'college': return 'college';
      case 'faculty': return 'faculty';
      case 'staff': return 'staff';
      case 'admin': return 'admin';
      default: return '';
    }
  }

  // ------------------------
  // CHART FUNCTIONS
  // ------------------------

  renderCharts(): void {
    if (!this.departments?.length) return;

    this.departments.forEach((dept) => {
      const canvas = document.getElementById(`dept-${dept.id}`) as HTMLCanvasElement;

      if (!canvas) return;

      const chart = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: ['Present', 'Late', 'Absent'],
          datasets: [
            {
              data: [dept.present, dept.late, dept.absent],
              backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          cutout: '70%',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.parsed}`,
              },
            },
          },
        },
      });

      this.charts.push(chart);
    });
  }

  destroyAllCharts() {
    this.charts.forEach((chart) => chart.destroy());
    this.charts = [];
  }

  onDepartmentClick(dept: any) {
    this.departmentClick.emit(dept);
  }
}
