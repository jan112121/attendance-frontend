import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: any = null;

  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {
    // ✅ Restore user from localStorage when app reloads
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing stored user', e);
        this.currentUser = null;
      }
    }
  }

  // REGISTER
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
    
  }

  // LOGIN
  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
    
  }

  // Save token + user info
  loginUser(data: any) {
   if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    if (data?.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      this.currentUser = data.user; // ✅ also update currentUser
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
  }

  // Token getter
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Safe user getter
  getUser(): any | null {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      return null;
    }
  }

  // ✅ Role getter (optional helper)
  getRole(): string | null {
    const user = this.getUser();
    return user?.role ?? null;
  }

  // Logged-in check
  isLoggedIn(): boolean {
    return !!this.getToken();
  }


}
