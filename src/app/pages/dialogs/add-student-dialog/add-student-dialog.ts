import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-student-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './add-student-dialog.html',
  styleUrl: './add-student-dialog.scss',
})
export class AddStudentDialog {
  form: FormGroup;
  schoolLevels: any[] = [];
  grades: any[] = [];

  apiUrl = 'http://localhost:5000/api/master-list'; // backend endpoint

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddStudentDialog>,
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      student_number: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      parent_name: [''],
      parent_number: [''],
      parent_email: [''],
      school_level_id: [null, Validators.required],
      grade_id: [null, Validators.required],
      section: [''],
      room_number: [''],
      additional_info: [''],
    });

    this.loadSchoolLevels();
  }

  loadSchoolLevels() {
    this.http.get<any[]>('http://localhost:5000/api/school-levels').subscribe({
      next: (res) => (this.schoolLevels = res),
      error: () => this.snackBar.open('Failed to load school levels', 'Close', { duration: 3000 }),
    });
  }

  onSchoolLevelChange(levelId: number) {
    this.form.patchValue({ grade_id: null });
    this.http.get<any[]>(`http://localhost:5000/api/grades/by-level/${levelId}`).subscribe({
      next: (res) => (this.grades = res),
      error: () => this.snackBar.open('Failed to load grades', 'Close', { duration: 3000 }),
    });
  }

  onSave() {
    if (!this.form.valid) return;

    this.http.post(`${this.apiUrl}/add`, this.form.value).subscribe({
      next: () => {
        this.snackBar.open('✅ Student added successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => this.snackBar.open('❌ Failed to add student', 'Close', { duration: 3000 }),
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
