import { Component} from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

login() {
  if (!this.email || !this.password) {
    this.error = 'Email and password are required';
    return;
  }

  this.loading = true;
  this.error = '';

  const credentials = { email: this.email, password: this.password };

  this.auth.login(credentials).subscribe({
    next: (res: any) => {
      this.loading = false;

      // Save token and user info
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));

      // Set current user in AuthService
      this.auth.currentUser = res.user;

      // ✅ Role-based routing
      switch (res.user.role_id) {
        case 1: // Admin
          this.router.navigate(['/dashboard']);
          break;
        case 2: // Student
        case 4: // Student Council
          this.router.navigate(['/student-dashboard']);
          break;
        case 5: // Teacher
          this.router.navigate(['/teacher-dashboard']);
          break;
        default: // fallback
          this.router.navigate(['/login']);
      }
    },
    error: (err) => {
      this.loading = false;
      this.error = err.error.message || 'Login failed';
    },
  });
}

}
