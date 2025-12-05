import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';


@Component({
  selector: 'app-add-user-dialog',
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatOptionModule, MatDialogModule],
  templateUrl: './add-user-dialog.html',
  styleUrl: './add-user-dialog.scss',
})
export class AddUserDialog {
  newUser = {
    first_name: '',
    last_name: '',
    email: '',
    student_number: '',
    role_id: '',
    contact_number: '',
    password: '',
  };

  constructor(public dialogRef: MatDialogRef<AddUserDialog>) {}

  onSave() {
    if (this.newUser.first_name && this.newUser.last_name && this.newUser.email && this.newUser.student_number && this.newUser.role_id && this.newUser.password && this.newUser.contact_number) {
      this.dialogRef.close(this.newUser);
    }
  }

  onCancel(){
    this.dialogRef.close();
  }
}
