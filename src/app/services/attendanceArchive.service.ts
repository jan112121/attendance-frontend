import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AttendanceArchiveService {
  private apiUrl = `${environment.apiUrl}/api`;
  constructor(private http: HttpClient) {}

  getWeeklyAttendance() {
    return this.http.get<{ labels: string[]; data: number[] }>(`${this.apiUrl}/attendance/weekly`);
  }
}