import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { Routes, provideRouter } from '@angular/router'; // CORRECTED LINE HERE
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // Required for Angular Material animations

import { authGuard } from './guards/auth.guard';
import { provideNativeDateAdapter } from '@angular/material/core'; // For MatDatepicker if used, general good practice for Material
import { LoginComponent } from './components/login/login/login.component';
import { ServiceRequestDetailComponent } from './components/service-request-detail/service-request-detail/service-request-detail.component';
import { ServiceRequestFormComponent } from './components/service-request-form/service-request-form/service-request-form.component';
import { ServiceRequestListComponent } from './components/service-request-list/service-request-list/service-request-list.component';


// Define the routes for your application
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'requests', component: ServiceRequestListComponent, canActivate: [authGuard] },
  { path: 'requests/new', component: ServiceRequestFormComponent, canActivate: [authGuard] },
  { path: 'requests/edit/:id', component: ServiceRequestFormComponent, canActivate: [authGuard] },
  { path: 'requests/:id', component: ServiceRequestDetailComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/requests', pathMatch: 'full' },
  { path: '**', redirectTo: '/requests' }
];

// Define the application configuration
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Angular's change detection
    provideRouter(routes), // Router configuration
    provideHttpClient(), // HTTP client for API calls
    provideAnimations(), // Required for Angular Material animations
    provideNativeDateAdapter() // Good practice for Angular Material date components
    // No need to explicitly import MatSnackBarModule or MatDialogModule here as they are provided
    // via `provideAnimations()` or their individual standalone components.
  ]
};
