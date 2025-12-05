import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  /** 👤 Authenticated user data */
  user: any = null;
  role: string | null = null;

  /** 📂 Sidebar toggle control */
  @Input() sidebarOpen = true;
  @Output() toggleSidebarEvent = new EventEmitter<boolean>();

  /** 🔔 Dropdown controls */
  showNotifications = false;
  showProfileMenu = false;
  showInfo = false;

  /** 📨 Example notifications */
  notifications = [
    'Student Kei Lance checked in late',
    'New device added by admin',
    'Teacher report submitted',
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.role = this.authService.getRole();
  }

  /** 🎚️ Toggle sidebar + inform parent layout */
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.toggleSidebarEvent.emit(this.sidebarOpen);
  }

  /** 🔔 Toggle notifications dropdown */
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.closeOtherMenus('notifications');
  }

  /** 👤 Toggle profile dropdown */
  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    this.closeOtherMenus('profile');
  }

  /** ℹ️ Toggle system info dropdown */
  toggleInfo(): void {
    this.showInfo = !this.showInfo;
    this.closeOtherMenus('info');
  }

  /** 🚪 Logout user */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /** 🧹 Helper: Close other menus when one opens */
  private closeOtherMenus(openMenu: 'notifications' | 'profile' | 'info'): void {
    if (openMenu !== 'notifications') this.showNotifications = false;
    if (openMenu !== 'profile') this.showProfileMenu = false;
    if (openMenu !== 'info') this.showInfo = false;
  }
}
