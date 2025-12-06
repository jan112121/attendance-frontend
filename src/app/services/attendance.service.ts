import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/api/attendance`;

  constructor(private http: HttpClient) {}

  // Send both aztecData and image to backend
  verifyAttendance(payload: { aztecData: string; aztecImage: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, payload);
  }
}
