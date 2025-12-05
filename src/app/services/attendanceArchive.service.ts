import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AttendanceArchiveService {
  constructor(private http: HttpClient) {}

  getWeeklyAttendance() {
    return this.http.get<{ labels: string[]; data: number[] }>('/api/attendance/weekly');
  }
}