import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SettingDialog } from '../../pages/dialogs/setting-dialog/setting-dialog';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, NgIf],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'], // ✅ corrected
})
export class Sidebar {
  @Input() isOpen: boolean = true; // controls collapsed/expanded

  // Dropdown states
  recordsDropdownOpen = false;
  attendanceDropdownOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  /** Toggle sidebar collapsed/expanded */
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  /** Toggle dropdown menus */
  toggleDropdown(type: 'records' | 'attendance'): void {
    if (type === 'records') {
      this.recordsDropdownOpen = !this.recordsDropdownOpen;
      this.attendanceDropdownOpen = false;
    } else if (type === 'attendance') {
      this.attendanceDropdownOpen = !this.attendanceDropdownOpen;
      this.recordsDropdownOpen = false;
    }
  }

  /** Logout user */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openSettingDialog() {
    this.dialog.open(SettingDialog, { width: '500px', });
  }
}
