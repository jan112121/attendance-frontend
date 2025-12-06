import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditStudentDialog } from '../../dialogs/edit-student-dialog/edit-student-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AddStudentDialog } from '../../dialogs/add-student-dialog/add-student-dialog';
import { environment } from '../../../../environments/environments';

export interface MasterListCnt {
  id?: number;
  student_number: string;
  first_name: string;
  last_name: string;

  parent_name?: string;
  parent_number?: string;
  parent_email?: string;

  section?: string;
  room_number?: string;
  additional_info?: string;

  school_level_id?: number;
  grade_id?: number;

  schoolLevel?: { id: number; level_name: string };
  grade?: { id: number; grade_name: string };
}

@Component({
  selector: 'app-master-list',
  imports: [
    FormsModule,
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSnackBarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './master-list.html',
  styleUrls: ['./master-list.scss'],
})
export class MasterList implements OnInit {
  selectedFile: File | null = null;
  message = '';
  success = false;
  masterList: MasterListCnt[] = [];

  displayedColumns: string[] = [
    'student_number',
    'first_name',
    'last_name',
    'parent_name',
    'parent_number',
    'parent_email',
    'schoolLevel',
    'grade',
    'section',
    'room_number',
    'edit_student',
  ];

  dataSource = new MatTableDataSource<MasterListCnt>();

  currentPage = 1;
  totalItems = 0;
  pageSize = 50;
  pageIndex = 0;

  spinnerLoading = false;
  loading = false;
  filterValue = '';
  importText = '';
  apiUrl = `${environment.apiUrl}/api/master-list`;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.fetchList();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) return;

    this.spinnerLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>(`${this.apiUrl}/upload`, formData).subscribe({
      next: (res) => {
        this.spinnerLoading = false;
        this.message = `${res.message} (${res.addedCount ?? 0}) records imported.`;
        this.success = true;
        this.snackBar.open('Import Successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.fetchList();
        this.selectedFile = null;
      },
      error: (err) => {
        this.spinnerLoading = false;
        this.message = err.error.message || 'File upload failed.';
        this.success = false;
        this.snackBar.open('Import Failed. Please try again', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  fetchList(page: number = 1, limit: number = 50) {
    this.loading = true;
    this.http
      .get<{
        totalItems: number;
        totalPages: number;
        currentPage: number;
        students: MasterListCnt[];
      }>(`${this.apiUrl}?page=${page}&limit=${limit}`)
      .subscribe({
        next: (res) => {
          this.masterList = res.students;
          this.dataSource.data = res.students;
          this.totalItems = res.totalItems;
          this.pageIndex = res.currentPage - 1;
          this.pageSize = limit;
          this.dataSource.sort = this.sort;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.dataSource.filterPredicate = (data: MasterListCnt, filter: string) => {
      const text = [
        data.student_number,
        data.first_name,
        data.last_name,
        data.parent_name,
        data.parent_number,
        data.parent_email,
        data.section,
        data.room_number,
        data.schoolLevel?.level_name,
        data.grade?.grade_name,
      ]
        .join(' ')
        .toLowerCase();
      return text.includes(filter);
    };
    this.dataSource.filter = filterValue;
  }

  openEditDialog(student: MasterListCnt) {
    const dialogRef = this.dialog.open(EditStudentDialog, { width: '600px', data: { ...student } });
    dialogRef.afterClosed().subscribe((result: MasterListCnt) => {
      if (result) {
        this.http.put(`${this.apiUrl}/${student.id}`, result).subscribe({
          next: () => {
            this.snackBar.open('✅ Student updated successfully!', 'Close', { duration: 3000 });
            this.fetchList(this.currentPage, this.pageSize);
          },
          error: () => {
            this.snackBar.open('❌ Failed to update student.', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }

  deleteStudent(id: number) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.snackBar.open('✅ Student deleted successfully!', 'Close', { duration: 3000 });
        this.fetchList(this.currentPage, this.pageSize);
      },
      error: () => {
        this.snackBar.open('❌ Failed to delete student.', 'Close', { duration: 3000 });
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.fetchList(this.currentPage, this.pageSize);
  }

  clearList() {
    if (!confirm('Are you sure you want to clear all master list records?')) return;
    this.http.delete(`${this.apiUrl}/`).subscribe({
      next: () => {
        this.snackBar.open('✅ Master list cleared', 'Close', { duration: 3000 });
        this.fetchList();
      },
      error: () => this.snackBar.open('❌ Failed to clear list', 'Close', { duration: 3000 }),
    });
  }

  importJson() {
    try {
      const jsonData = JSON.parse(this.importText);
      if (!Array.isArray(jsonData)) return alert('JSON must be array of records.');
      this.http.post(`${this.apiUrl}/bulk`, jsonData).subscribe({
        next: (res: any) => {
          alert(`Imported ${res.count} records successfully.`);
          this.importText = '';
          this.fetchList();
        },
        error: () => alert('Failed to import Master list'),
      });
    } catch {
      alert('Invalid JSON format.');
    }
  }

  openAddStudentDialog() {
    const dialogRef = this.dialog.open(AddStudentDialog, { width: '600px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.fetchList(); // refresh table if added
    });
  }
}
