import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements OnInit {
  @Input() sidebarOpen = true;
  @Output() toggleSidebarEvent = new EventEmitter<boolean>();

  isMobile = false; // track if mobile screen
  user: any = null;
  showProfileMenu = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.checkScreenWidth();
  }

  /** Toggle sidebar */
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.toggleSidebarEvent.emit(this.sidebarOpen);
  }

  /** Handle window resize to update mobile state */
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.checkScreenWidth();
  }

  private checkScreenWidth(): void {
    const width = window.innerWidth;
    this.isMobile = width < 768; // standard mobile breakpoint
    // Optional: collapse sidebar automatically on mobile
    if (this.isMobile && this.sidebarOpen) {
      this.sidebarOpen = false;
      this.toggleSidebarEvent.emit(this.sidebarOpen);
    }
  }

  /** Toggle profile dropdown */
  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
