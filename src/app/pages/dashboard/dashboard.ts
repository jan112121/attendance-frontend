import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';

import { DashboardService } from '../../services/dashboard-data.service';
import { ArchiveReportsService } from '../../services/archive-reports.service';
import { DepartmentDetails } from '../dialogs/department-details/department-details';
import { DoughnutChart } from './charts/doughnut-chart/doughnut-chart';
import { BarChart } from './charts/bar-chart/bar-chart';
import { LineChart } from './charts/line-chart/line-chart';
import { WeeklyAttendanceData } from '../../models/weekly-attendance.model';

interface Department {
  id: number;
  name: string;
  total: number;
  present: number;
  late: number;
  absent: number;
  attendancePercentage: {
    present: number;
    late: number;
    absent: number;
  };
  grades: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, DoughnutChart, BarChart, LineChart],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  stats: any = {};
  departments: Department[] = [];
  reports: any[] = [];
  loading = true;

  weeklyAttendance: WeeklyAttendanceData = { labels: [], datasets: [] };

  constructor(
    private dialog: MatDialog,
    private archiveService: ArchiveReportsService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    Chart.register(...registerables);
    this.loadDashboard();
    this.loadReports();
  }

  openDepartmentDetails(dept: Department) {
    this.dialog.open(DepartmentDetails, { width: '500px', data: dept });
  }

  private loadDashboard() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.departments = data.departments;
        this.loading = false;

        // Fetch weekly attendance after dashboard stats
        this.dashboardService.getWeeklyAttendance().subscribe({
          next: (res: any) => {
            // Transform API response into WeeklyAttendanceData
            this.weeklyAttendance = {
              labels: res.labels,
              datasets: [
                {
                  label: 'Present',
                  data: res.presentData,
                  borderColor: '#4CAF50',
                  backgroundColor: 'rgba(76,175,80,0.2)',
                  fill: true,
                  tension: 0.3,
                  pointBackgroundColor: '#4CAF50',
                  pointBorderColor: '#fff',
                  pointRadius: 5,
                },
                {
                  label: 'Late',
                  data: res.lateData,
                  borderColor: '#FFC107',
                  fill: true,
                  tension: 0.3,
                  pointBackgroundColor: '#FFC107',
                  pointBorderColor: '#fff',
                  pointRadius: 5,
                },
                {
                  label: 'Absent',
                  data: res.absentData,
                  borderColor: '#F44336',
                  fill: true,
                  tension: 0.3,
                  pointBackgroundColor: '#F44336',
                  pointBorderColor: '#fff',
                  pointRadius: 5,
                },
              ],
            };
          },
          error: (err) => console.error('❌ Failed to load weekly attendance:', err),
        });
      },
      error: (err) => {
        console.error('❌ Failed to load dashboard data:', err);
        this.loading = false;
      },
    });
  }

  private loadReports() {
    this.archiveService.getReports().subscribe({
      next: (res) => (this.reports = res),
      error: (err) => console.error('❌ Failed to load archive reports:', err),
    });
  }

  getDepartmentIcon(name: string): string {
    const dept = name.toLowerCase();

    switch (dept) {
      case 'elementary':
        return 'fa-solid fa-pencil';
      case 'junior highschool':
      case 'junior high school':
        return 'fa-solid fa-book';
      case 'senior highschool':
      case 'senior high school':
        return 'fa-solid fa-user-graduate';
      case 'college':
        return 'fa-solid fa-university';
      case 'faculty':
        return 'fa-solid fa-chalkboard-teacher';
      case 'staff':
        return 'fa-solid fa-briefcase';
      case 'admin':
      case 'administration':
        return 'fa-solid fa-user-tie';
      default:
        return 'fa-solid fa-school';
    }
  }
}
