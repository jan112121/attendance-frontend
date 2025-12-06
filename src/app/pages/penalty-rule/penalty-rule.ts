import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-penalty-rule',
  imports: [CommonModule,FormsModule],
  templateUrl: './penalty-rule.html',
  styleUrl: './penalty-rule.scss'
})
export class PenaltyRules implements OnInit {
  rules: any[] = [];
  newRule = { condition: '', amount: '' };
  apiUrl = `${environment.apiUrl}/api/penalty-rules`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRules();
  }

  loadRules() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => this.rules = data);
  }

  addRule() {
    this.http.post(this.apiUrl, this.newRule).subscribe(() => {
      this.loadRules();
      this.newRule = { condition: '', amount: '' };
    });
  }

  updateRule(rule: any) {
    this.http.put(`${this.apiUrl}/${rule.id}`, rule).subscribe(() => this.loadRules());
  }

  deleteRule(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.loadRules());
  }
}
