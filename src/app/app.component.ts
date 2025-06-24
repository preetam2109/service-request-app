import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule for router-outlet
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Ensure MatSnackBarModule is available for the whole app
import { MatDialogModule } from '@angular/material/dialog'; // Ensure MatDialogModule is available for the whole app

@Component({
  selector: 'app-root',
  standalone: true, // Mark as standalone
  imports: [
    RouterModule, // Needed for <router-outlet>
    MatSnackBarModule, // Providing MatSnackBar as part of app.config.ts but including here for safety
    MatDialogModule // Providing MatDialog as part of app.config.ts but including here for safety
  ],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent {
  title = 'service-request-app';
}