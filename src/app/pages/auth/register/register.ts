import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register implements OnInit {
  // 🧍 User info
  first_name = '';
  last_name = '';
  email = '';
  studentNumber = '';
  contact_number = '';
  password = '';
  confirmPassword = '';

  // ✅ Status & messages
  error = '';
  success = '';
  aztecImage: string | null = null;
  loadng = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {}

  // ✅ Register the user
  register() {
    this.error = '';
    this.success = '';

    if (
      !this.first_name ||
      !this.last_name ||
      !this.email ||
      !this.studentNumber ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    const user = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
      student_number: this.studentNumber,
      contact_number: this.contact_number,
      role_id: 2,
    };

    this.auth.register(user).subscribe({
      next: (res) => {
        // console.log('Registration success:', res);
        this.aztecImage = res.aztecImage;
        this.success = 'Registration successful! Redirecting...';
        this.router.navigate(['/register-success'], {
          state: { aztecImage: res.aztecImage },
        });
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.error = err.error?.message || 'Registration failed.';
      },
    });
  }
}
