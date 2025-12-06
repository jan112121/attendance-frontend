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
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        // ✅ Role-based redirect
        // console.log('User data:', res.user);
        this.auth.currentUser = res.user; // Set current user
        if (res.user.role_id === 1) {
          this.router.navigate(['/dashboard']);
        } else if (res.user.role_id === 2) {
          this.router.navigate(['/student-dashboard']);
        }else {
          this.router.navigate(['/teacher-dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message || 'Login failed';
      },
    });
  }
}
