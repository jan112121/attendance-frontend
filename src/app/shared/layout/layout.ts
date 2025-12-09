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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Only on mobile/tablet
    if (!this.isMobile || !this.sidebarOpen) return;

    const target = event.target as HTMLElement;

    // Check if the click is inside the sidebar or toggle button
    const clickedInsideSidebar = target.closest('.sidebar');
    const clickedToggleButton = target.closest('.navbar button');

    if (!clickedInsideSidebar && !clickedToggleButton) {
      this.sidebarOpen = false; // close sidebar
    }
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
