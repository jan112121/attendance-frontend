import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = '/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

getWeeklyAttendance() {
  return this.http.get<{ labels: string[]; data: number[] }>(`${this.apiUrl}/attendance/archive/weekly`);
}

}
