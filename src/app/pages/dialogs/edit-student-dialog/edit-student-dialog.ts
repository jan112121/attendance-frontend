import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-edit-student-dialog',
  templateUrl: './edit-student-dialog.html',
  styleUrls: ['./edit-student-dialog.scss'],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
  ],
})
export class EditStudentDialog implements OnInit {
  form: FormGroup;

  schoolLevels: any[] = [];
  grades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditStudentDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      student_number: [data.student_number, Validators.required],
      first_name: [data.first_name, Validators.required],
      last_name: [data.last_name, Validators.required],
      parent_name: [data.parent_name, Validators.required],
      parent_number: [data.parent_number, Validators.required],
      parent_email: [data.parent_email, Validators.required],
      school_level_id: [data.schoolLevel?.id, Validators.required],
      grade_id: [data.grade?.id, Validators.required],
      section: [data.section, Validators.required],
      room_number: [data.room_number, Validators.required],
    });
  }

  ngOnInit(): void {
    // Fetch school levels
    this.http.get(`${environment.apiUrl}/api/school-levels`).subscribe((res: any) => {
      this.schoolLevels = res;
    });

    // Fetch grades whenever school level changes
    this.form.get('school_level_id')?.valueChanges.subscribe((levelId) => {
      if (!levelId) {
        this.grades = [];
        this.form.get('grade_id')?.setValue(null);
        return;
      }
      this.http.get(`${environment.apiUrl}/api/grades/by-level/${levelId}`).subscribe((res: any) => {
        this.grades = res;
        // Reset grade if it doesn't belong to selected level
        const currentGrade = this.form.get('grade_id')?.value;
        if (!this.grades.find(g => g.id === currentGrade)) {
          this.form.get('grade_id')?.setValue(null);
        }
      });
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
