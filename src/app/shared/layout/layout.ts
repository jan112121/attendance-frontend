import { Component, HostListener, OnInit } from '@angular/core';
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
  sidebarOpen = true;
  innerWidth: number = window.innerWidth;

  ngOnInit() {
    this.updateSidebarState();
  }

  toggleSidebar(state?: boolean) {
    this.sidebarOpen = state !== undefined ? state : !this.sidebarOpen;
  }

  @HostListener('window:resize')
  onResize() {
    this.innerWidth = window.innerWidth;
    this.updateSidebarState();
  }

  private updateSidebarState() {
    const width = this.innerWidth;
    if (width < 768) {
      this.sidebarOpen = false;
    } else if (width >= 768 && width < 992) {
      this.sidebarOpen = false;
    } else {
      this.sidebarOpen = true;
    }
  }

  get isMobile(): boolean {
    return this.innerWidth < 992;
  }
}

