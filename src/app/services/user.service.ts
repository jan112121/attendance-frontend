import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  student_number?: string;
  grade_level?: string;
  section?: string;
  room_number?: string;
  contact_number?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    const token = localStorage.getItem('token'); // JWT saved after login
    if (!token) {
      console.error('No token found in localStorage');
    }
    return this.http.get(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateUser(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  addUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, userData);
  }
}
