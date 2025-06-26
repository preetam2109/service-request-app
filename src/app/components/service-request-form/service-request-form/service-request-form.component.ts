import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common'; // For *ngIf
import { ServiceRequest } from '../../../models/service-request.model';
import { ServiceRequestService } from '../../../services/service-request.service';

@Component({
  selector: 'app-service-request-form',
  standalone: true, // Mark as standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, // For routerLink
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './service-request-form.component.html',
  styleUrls: ['./service-request-form.component.css']
})
export class ServiceRequestFormComponent implements OnInit {
  requestForm: FormGroup;
  isEditMode = false;
  requestId: number | null = null;
  pageTitle = 'Create New Service Request';
  availableStatuses: string[] = ['Open', 'In Progress', 'Closed'];

  constructor(
    private fb: FormBuilder,
    private serviceRequestService: ServiceRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.requestForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      status: ['Open', Validators.required], // Default status
      createdBy: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.requestId = +id;
        this.pageTitle = 'Edit Service Request';
        this.loadRequest(this.requestId);
      }
    });
  }

  loadRequest(id: number): void {
    this.serviceRequestService.getServiceRequestById(id).subscribe({
      next: (request) => {
        this.requestForm.patchValue({
          title: request.title,
          description: request.description,
          status: request.status,
          createdBy: request.createdBy
        });
        // Disable createdBy and CreatedDate in edit mode as they are not editable
        this.requestForm.controls['createdBy'].disable();
      },
      error: (err) => {
        this.snackBar.open(`Error loading request: ${err.message}`, 'Close', { duration: 5000 });
        this.router.navigate(['/requests']);
      }
    });
  }

  onSubmit(): void {
    if (this.requestForm.invalid) {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', { duration: 3000 });
      this.requestForm.markAllAsTouched(); // Show validation errors
      return;
    }

    const formData: ServiceRequest = {
      ...this.requestForm.getRawValue() // Use getRawValue to include disabled fields
    };

    if (this.isEditMode && this.requestId) {
       // FIX: Explicitly set the ID for PUT requests to avoid ID mismatch with backend
       formData.id = this.requestId; // <-- THIS IS THE CRUCIAL LINE
      this.serviceRequestService.updateServiceRequest(this.requestId, formData).subscribe({
        next: () => {
          this.snackBar.open('Request updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/requests']);
        },
        error: (err) => {
          this.snackBar.open(`Error updating request: ${err.message}`, 'Close', { duration: 5000 });
        }
      });
    } else {
      this.serviceRequestService.createServiceRequest(formData).subscribe({
        next: () => {
          this.snackBar.open('Request created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/requests']);
        },
        error: (err) => {
          this.snackBar.open(`Error creating request: ${err.message}`, 'Close', { duration: 5000 });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/requests']);
  }
}
