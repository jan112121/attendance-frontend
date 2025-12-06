import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  // -----------------------
  // STUDENT DASHBOARD
  // -----------------------
  getStudentDashboard(studentId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/student-dashboard/${studentId}`);
  }

  // -----------------------
  // ATTENDANCE
  // -----------------------
  getAttendanceByStudent(studentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/attendance/student/${studentId}`);
  }

  // -----------------------
  // USERS
  // -----------------------
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }
}
