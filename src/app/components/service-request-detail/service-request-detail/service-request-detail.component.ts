import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common'; // For *ngIf, date pipe
import { ServiceRequest } from '../../../models/service-request.model';
import { ServiceRequestService } from '../../../services/service-request.service';

@Component({
  selector: 'app-service-request-detail',
  standalone: true, // Mark as standalone
  imports: [
    CommonModule,
    RouterModule, // For routerLink
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './service-request-detail.component.html',
  styleUrls: ['./service-request-detail.component.css']
})
export class ServiceRequestDetailComponent implements OnInit {
  request: ServiceRequest | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceRequestService: ServiceRequestService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.serviceRequestService.getServiceRequestById(+id).subscribe({
        next: (data) => {
          this.request = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.snackBar.open(`Error loading request details: ${err.message}`, 'Close', { duration: 5000 });
          this.router.navigate(['/requests']);
          this.isLoading = false;
        }
      });
    } else {
      this.router.navigate(['/requests']);
      this.isLoading = false;
    }
  }

  backToList(): void {
    this.router.navigate(['/requests']);
  }

  editRequest(): void {
    if (this.request?.id) {
      this.router.navigate(['/requests/edit', this.request.id]);
    }
  }
}
