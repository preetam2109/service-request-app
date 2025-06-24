import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; // Import for standalone
import { MatButtonModule } from '@angular/material/button'; // Import for standalone

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true, // Mark as standalone
  imports: [
    MatDialogModule, // Provides mat-dialog-title, mat-dialog-content, mat-dialog-actions
    MatButtonModule // Provides mat-button, mat-raised-button
  ],
  template: `
    <h2 mat-dialog-title>Confirm Action</h2>
    <mat-dialog-content>{{ data }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true" cdkFocusInitial>Confirm</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
