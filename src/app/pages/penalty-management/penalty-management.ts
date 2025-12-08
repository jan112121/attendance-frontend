import { Component, OnInit } from '@angular/core';
import { PenaltyService } from '../../services/penalty.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PenaltyRules } from '../penalty-rule/penalty-rule';

@Component({
  selector: 'app-penalty-management',
  imports: [CommonModule, FormsModule, NgFor],
  templateUrl: './penalty-management.html',
  styleUrl: './penalty-management.scss',
})
export class PenaltyManagement implements OnInit {
  penalties: any[] = [];
  loading = true;
  editPenaltyId: number | null = null;
  editData: any = {};

  constructor(private penaltyService: PenaltyService) {}

  ngOnInit() {
    this.loadPenalties();
  }

  loadPenalties() {
    this.penaltyService.getAllPenalties().subscribe({
      next: (data) => {
        this.penalties = data;
        this.loading = false;
      },
      error: (err) => console.error(err),
    });
  }

  startEdit(penalty: any) {
    this.editPenaltyId = penalty.id;
    this.editData = { ...penalty };
  }

  saveEdit() {
    if (!this.editPenaltyId) return;
    this.penaltyService.updatePenalty(this.editPenaltyId, this.editData).subscribe({
      next: () => {
        this.editPenaltyId = null;
        this.loadPenalties();
      },
      error: (err) => console.error(err),
    });
  }

  cancelEdit() {
    this.editPenaltyId = null;
  }

  deletePenalty(id: number) {
    if (confirm('Are you sure you want to delete this penalty?')) {
      this.penaltyService.deletePenalty(id).subscribe({
        next: () => this.loadPenalties(),
        error: (err) => console.error(err),
      });
    }
  }
  markAsPaid(id: number) {
    if (!confirm('Are you sure you want to mark this penalty as paid?')) return;

    this.penaltyService.markAsPaid(id).subscribe({
      next: () => {
        // Reload penalties to update the table
        this.loadPenalties();
      },
      error: (err) => console.error(err),
    });
  }
}
