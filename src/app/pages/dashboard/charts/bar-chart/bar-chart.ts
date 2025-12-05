import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.html',
  styleUrls: ['./bar-chart.scss'],
})
export class BarChart implements OnInit, OnChanges {
  @Input() stats: any; // 👈 Data from Dashboard
  @ViewChild('attendanceChart') attendanceChart!: ElementRef<HTMLCanvasElement>;

  chart?: Chart;

  ngOnInit(): void {
    // Wait for stats to load before rendering
    setTimeout(() => this.renderChart(), 300);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stats'] && !changes['stats'].firstChange) {
      this.updateChart();
    }
  }

  private renderChart(): void {
    if (!this.stats || !this.attendanceChart) return;

    const ctx = this.attendanceChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const present = this.stats.attendanceBreakdown?.present || 0;
    const late = this.stats.attendanceBreakdown?.late || 0;
    const absent = this.stats.attendanceBreakdown?.absent || 0;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Present', 'Late', 'Absent'],
        datasets: [
          {
            label: 'Students',
            data: [present, late, absent],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
            borderRadius: 8,
            barThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed.y} students`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#333', font: { size: 13, weight: 'bold' } },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#eee' },
            ticks: { color: '#666', font: { size: 12 } },
          },
        },
      },
    });
  }

  /** 🔄 Updates chart data dynamically */
  private updateChart(): void {
    if (!this.chart || !this.stats) return;

    const present = this.stats.attendanceBreakdown?.present || 0;
    const late = this.stats.attendanceBreakdown?.late || 0;
    const absent = this.stats.attendanceBreakdown?.absent || 0;

    this.chart.data.datasets[0].data = [present, late, absent];
    this.chart.data.labels = ['Present', 'Late', 'Absent'];
    this.chart.data.datasets[0].backgroundColor = ['#4CAF50', '#FFC107', '#F44336'];
    this.chart.update();
  }
}
