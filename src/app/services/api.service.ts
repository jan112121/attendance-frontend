import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api'; // change if needed

  constructor(private http: HttpClient) {}

  // -----------------------
  // STUDENT DASHBOARD
  // -----------------------
// add inside ApiService class
getStudentDashboard(studentId: string) {
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
  getUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }
}
