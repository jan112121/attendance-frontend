import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-details',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './department-details.html',
  styleUrls: ['./department-details.scss'], // fixed typo
})
export class DepartmentDetails implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    Chart.register(...registerables);
    setTimeout(() => this.renderBarChart(), 200);
  }

  renderBarChart() {
    const ctx: any = document.getElementById('deptBarChart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Present', 'Late', 'Absent'],
        datasets: [
          {
            label: `${this.data.name} Department`,
            data: [this.data.present, this.data.late || 0, this.data.absent],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336'], // green / amber / red
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            font: { size: 18, weight: 'bold' },
            color: '#333',
          },
        },
        scales: {
          x: {
            ticks: { color: '#555', font: { size: 13 } },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#555' },
            grid: { color: '#eee' },
          },
        },
      },
    });
  }
}
