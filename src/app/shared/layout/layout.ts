import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Navbar, Sidebar, RouterModule, MatIconModule, CommonModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'], // ✅ corrected
})
export class Layout {
  sidebarOpen = true; // start expanded

  /** Toggle sidebar collapsed/expanded */
  toggleSidebar(state?: boolean) {
    this.sidebarOpen = state !== undefined ? state : !this.sidebarOpen;
  }
}
