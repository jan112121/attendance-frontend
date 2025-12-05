import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('K-12-Smart-Attendance');

  constructor(public auth: AuthService, private router: Router) {}

  isAuthPage(): boolean {
    const url = this.router.url;
    return url === '/login' || url === '/register';
  }
}
