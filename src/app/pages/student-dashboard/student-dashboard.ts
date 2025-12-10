import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [RouterModule, CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.scss'],
})
export class StudentDashboard implements OnInit {
  student: any = null;
  isStudentOrCouncil: boolean = false;

  summary: any = {
    morning: { present: 0, late: 0, absent: 0 },
    afternoon: { present: 0, late: 0, absent: 0 },
  };

  penaltyTotal: number = 0;   // <--- NEW

  activeTab: string = 'info';
  showWelcome: boolean = true;

  sessions: ('morning' | 'afternoon')[] = ['morning', 'afternoon'];
  statuses: ('present' | 'late' | 'absent')[] = ['present', 'late', 'absent'];

  constructor(
    public authService: AuthService,
    private api: ApiService
  ) {}

  ngOnInit() {
    const role = this.authService.currentUser?.role_id;
    this.isStudentOrCouncil = [2,4].includes(role);

    if (this.isStudentOrCouncil){
      this.loadDashboard();
    }

    // Hide welcome after 3 seconds
    setTimeout(() => {
      this.showWelcome = false;
    }, 3000);
  }

  loadDashboard() {
    const studentId = this.authService.currentUser?.id;
    if (!studentId) return;

    this.api.getStudentDashboard(studentId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.student = res.student;
          this.summary = res.summary || this.summary;

          // NEW: Get unpaid penalty total
          this.penaltyTotal = res.penalties?.unpaid_total || 0;
        }
      },
      error: (err) => console.error(err),
    });
  }

  getPercentage(session: 'morning' | 'afternoon', status: 'present' | 'late' | 'absent'): number {
    const s = this.summary[session];
    const total = s.present + s.late + s.absent;
    return total === 0 ? 0 : (s[status] / total) * 100;
  }
}
