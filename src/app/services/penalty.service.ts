import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class PenaltyService {
  private apiUrl = `${environment.apiUrl}/api/penalties`;

  constructor(private http: HttpClient) {}

  getAllPenalties(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createPenalty(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updatePenalty(id: number, data: any) {
    return this.http.put(`/api/penalties/${id}`, data);
  }

  deletePenalty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ✅ New method
  markAsPaid(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/pay`, {});
  }
}
