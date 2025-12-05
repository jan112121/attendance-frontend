import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Dashboard } from '../dashboard/dashboard';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [RouterModule, Dashboard],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.scss'
})
export class TeacherDashboard {
  constructor(public authService: AuthService) { }
}
