import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.html',
  styleUrls: ['./register-success.scss']
})
export class RegisterSuccess {
  aztecImage: string | null = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.aztecImage = nav?.extras.state?.['aztecImage'] || localStorage.getItem('aztecImage');
    if (this.aztecImage) localStorage.setItem('aztecImage', this.aztecImage);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
