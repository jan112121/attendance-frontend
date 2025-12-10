import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-council-dashboard',
  imports: [RouterModule],
  templateUrl: './student-council-dashboard.html',
  styleUrl: './student-council-dashboard.scss'
})
export class StudentCouncilDashboard {
  constructor(public authService: AuthService) { }
}
