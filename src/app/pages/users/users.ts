import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { SnackbarService } from '../../services/snackBar.service';

import { UpdateUserDialog } from '../dialogs/update-user-dialog/update-user-dialog';
import { AddUserDialog } from '../dialogs/add-user-dialog/add-user-dialog';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  Users: any[] = [];
  allUsers: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  searchTerm: string = '';
  selectedTabIndex = 0;

  displayedColumns: string[] = [
    'student_number',
    'first_name',
    'last_name',
    'email',
    'contact_number',
    'role',
    'created_at',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // --- Load all users ---
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.allUsers = data || [];
        this.applyTabFilter(this.getCurrentTabLabel());
      },
      error: (err) => console.error('Error fetching users:', err),
    });
  }

  // --- Apply search filter ---
  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  // --- Handle tab switching ---
  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTabIndex = event.index;
    const label = event.tab.textLabel;
    this.applyTabFilter(label);
  }

  // --- Filter users by tab role ---
  applyTabFilter(label: string): void {
    let filtered = this.allUsers;

    switch ((label || '').toLowerCase()) {
      case 'teachers':
        filtered = this.allUsers.filter((u) => u.role_id === 5);
        break;
      case 'student councils':
      case 'student council':
        filtered = this.allUsers.filter((u) => u.role_id === 4);
        break;
      case 'students':
        filtered = this.allUsers.filter((u) => u.role_id === 2);
        break;
      default:
        filtered = this.allUsers;
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter((u) =>
        `${u.name} ${u.email} ${u.student_number}`.toLowerCase().includes(term)
      );
    }

    this.dataSource.data = filtered;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  // --- Refresh user list without reloading component ---
  refreshUserList(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.applyTabFilter(this.getCurrentTabLabel());
      },
      error: (err) => console.error('Error refreshing users:', err),
    });
  }

  // --- Get current tab label ---
  getCurrentTabLabel(): string {
    switch (this.selectedTabIndex) {
      case 1:
        return 'Teachers';
      case 2:
        return 'Student Councils';
      case 3:
        return 'Students';
      default:
        return 'All';
    }
  }

  // --- After user update, refresh and keep tab synced ---
  afterUserEdited(updatedUser: any): void {
    this.refreshUserList();

    switch (updatedUser.role_id) {
      case 5:
        this.selectedTabIndex = 1; // Teachers
        break;
      case 4:
        this.selectedTabIndex = 2; // Student Councils
        break;
      case 2:
        this.selectedTabIndex = 3; // Students
        break;
      default:
        this.selectedTabIndex = 0; // All
    }
  }

  // --- Edit user info ---
  editUser(user: any): void {
    const dialogRef = this.dialog.open(UpdateUserDialog, {
      width: '400px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.updateUser(user.id, result).subscribe({
          next: () => {
            this.loadUsers();
            this.snackBarService.show('✅ User updated successfully!');
          },
          error: (err) => {
            console.error('Error updating user:', err);
            this.showSnackbar('❌ Failed to update user', 'error');
          },
        });
      }
    });
  }

  // --- Remove user ---
  removeUser(user: any): void {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
        this.showSnackbar('🗑️ User deleted successfully!');
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.showSnackbar('❌ Failed to delete user', 'error');
      },
    });
  }

  // --- Add user modal ---
  openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddUserDialog, { width: '500px' });

    dialogRef.afterClosed().subscribe((newUser) => {
      if (newUser) {
        this.userService.addUser(newUser).subscribe({
          next: () => {
            this.loadUsers();
            this.showSnackbar('✅ User added successfully!');
          },
          error: (err) => {
            console.error('Error adding user:', err);
            this.showSnackbar('❌ Failed to add user', 'error');
          },
        });
      }
    });
  }

  showSnackbar(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error'],
    });
  }
}
