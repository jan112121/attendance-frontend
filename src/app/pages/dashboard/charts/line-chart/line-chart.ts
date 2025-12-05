import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { WeeklyAttendanceData } from '../../../../models/weekly-attendance.model';

Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.html',
  styleUrls: ['./line-chart.scss'],
})
export class LineChart implements OnInit, OnChanges {
  @Input() weeklyAttendance: WeeklyAttendanceData | null = null;
  @ViewChild('lineChart') lineChart!: ElementRef<HTMLCanvasElement>;

  chart?: Chart;

  ngOnInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weeklyAttendance'] && !changes['weeklyAttendance'].firstChange) {
      this.renderChart();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.chart?.resize();
  }

  private renderChart(): void {
    if (!this.lineChart) return;
    const ctx = this.lineChart.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    const labels = this.weeklyAttendance?.labels || [];
    const datasets = this.weeklyAttendance?.datasets || [];

    this.chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y} students`,
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#333' } },
          y: { beginAtZero: true, grid: { color: '#eee' }, ticks: { color: '#666' } },
        },
      },
    });
  }
}
