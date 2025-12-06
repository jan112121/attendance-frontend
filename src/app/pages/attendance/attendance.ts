import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environments';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';

// Interface for type safety
interface AttendanceRecord {
  id?: number;
  date: string | Date;
  time?: string;
  time_out?: string;
  status: string;
  session: string;
  User: {
    id?: number;
    first_name: string;
    last_name: string;
    name?: string; // optional if you want a combined field
    student_number: string;
    grade?: string;
    section?: string;
    room?: string;
    penalties?: {
      amount?: number;
      reason?: string;
      status?: string;
      created_at?: string;
    }[];
    master?: {
      grade_level?: string;
      section?: string;
      room_number?: string;
    };
  };
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
  ],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.scss'],
})
export class Attendance implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['first_name', 'last_name', 'section', 'time', 'status', 'time_out'];

  morningDataSource = new MatTableDataSource<AttendanceRecord>([]);
  afternoonDataSource = new MatTableDataSource<AttendanceRecord>([]);

  private originalRecords = {
    morning: [] as AttendanceRecord[],
    afternoon: [] as AttendanceRecord[],
  };

  selectedSession: string = '';
  selectedStatus: string = '';
  selectedDate: Date | null = null;
  loading = true;
  viewMode: 'today' | 'yesterday' = 'today'; // Toggle

  searchTerm: string = '';

  @ViewChild('morningPaginator') morningPaginator!: MatPaginator;
  @ViewChild('afternoonPaginator') afternoonPaginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAttendance();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.morningDataSource.paginator = this.morningPaginator;
      this.afternoonDataSource.paginator = this.afternoonPaginator;
      this.cdr.detectChanges(); // Force refresh view bindings
    }, 0);
  }

  /** Load attendance based on viewMode */
  loadAttendance(): void {
    this.loading = true;
    const url =
      this.viewMode === 'today'
        ? `${environment.apiUrl}/api/attendance/today`
        : `${environment.apiUrl}/api/attendance/yesterday`;

    this.http.get<AttendanceRecord[]>(url).subscribe({
      next: (records) => {
        // console.log(records)
        const morning = records.filter((r) => r.session.toLowerCase() === 'morning');
        const afternoon = records.filter((r) => r.session.toLowerCase() === 'afternoon');

        this.morningDataSource.data = morning;
        this.afternoonDataSource.data = afternoon;

        this.originalRecords.morning = [...morning];
        this.originalRecords.afternoon = [...afternoon];

        setTimeout(() => {
          if (this.morningPaginator) this.morningDataSource.paginator = this.morningPaginator;
          if (this.afternoonPaginator) this.afternoonDataSource.paginator = this.afternoonPaginator;
        }, 100);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading attendance:', err);
        this.morningDataSource.data = [];
        this.afternoonDataSource.data = [];
        this.loading = false;
      },
    });
  }

  /** Toggle between Today / Yesterday */
  toggleView(mode: 'today' | 'yesterday'): void {
    if (this.viewMode !== mode) {
      this.viewMode = mode;
      this.resetFilter();
      this.loadAttendance();
    }
  }

  /** Apply session, status, and date filters */
  applyFilters(): void {
    let filteredMorning = [...this.originalRecords.morning];
    let filteredAfternoon = [...this.originalRecords.afternoon];

    // Session filter
    if (this.selectedSession.toLowerCase() === 'morning') filteredAfternoon = [];
    if (this.selectedSession.toLowerCase() === 'afternoon') filteredMorning = [];

    // Status filter
    if (this.selectedStatus) {
      filteredMorning = filteredMorning.filter(
        (r) => r.status?.toLowerCase() === this.selectedStatus.toLowerCase(),
      );
      filteredAfternoon = filteredAfternoon.filter(
        (r) => r.status?.toLowerCase() === this.selectedStatus.toLowerCase(),
      );
    }

    // Date filter
    if (this.selectedDate) {
      const dateStr = new Date(this.selectedDate).toISOString().split('T')[0];
      filteredMorning = filteredMorning.filter(
        (r) => new Date(r.date).toISOString().split('T')[0] === dateStr,
      );
      filteredAfternoon = filteredAfternoon.filter(
        (r) => new Date(r.date).toISOString().split('T')[0] === dateStr,
      );
    }

    this.morningDataSource.data = filteredMorning;
    this.afternoonDataSource.data = filteredAfternoon;

    // Reset paginator to first page
    if (this.morningDataSource.paginator) this.morningDataSource.paginator.firstPage();
    if (this.afternoonDataSource.paginator) this.afternoonDataSource.paginator.firstPage();
  }

  /** Reset filters */
  resetFilter(): void {
    this.selectedSession = '';
    this.selectedStatus = '';
    this.selectedDate = null;

    this.morningDataSource.data = [...this.originalRecords.morning];
    this.afternoonDataSource.data = [...this.originalRecords.afternoon];

    // Reset paginator
    if (this.morningDataSource.paginator) this.morningDataSource.paginator.firstPage();
    if (this.afternoonDataSource.paginator) this.afternoonDataSource.paginator.firstPage();
  }

  /** Convert 24-hour time string to 12-hour AM/PM format */
  formatTime(time?: string): string {
    if (!time) return '-';
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  }

  applySearchFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    // Reset to original before filtering
    this.morningDataSource.data = this.originalRecords.morning.filter(
      (record) =>
        record.User?.first_name?.toLowerCase().includes(term) ||
        record.User?.last_name?.toLowerCase().includes(term) ||
        record.User?.master?.section?.toLowerCase().includes(term),
    );

    this.afternoonDataSource.data = this.originalRecords.afternoon.filter(
      (record) =>
        record.User?.first_name?.toLowerCase().includes(term) ||
        record.User?.last_name?.toLowerCase().includes(term) ||
        record.User?.master?.section?.toLowerCase().includes(term),
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.morningDataSource.data = [...this.originalRecords.morning];
    this.afternoonDataSource.data = [...this.originalRecords.afternoon];
  }
}
