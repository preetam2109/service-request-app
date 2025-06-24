import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { ServiceRequest } from '../../../models/service-request.model';
import { AuthService } from '../../../services/auth.service';
import { ServiceRequestService } from '../../../services/service-request.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-service-request-list',
  imports: [
    
    CommonModule,
    FormsModule,
    RouterModule, // For routerLink
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule

  ],
  templateUrl: './service-request-list.component.html',
  styleUrl: './service-request-list.component.css'
})
export class  ServiceRequestListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'status', 'createdBy', 'createdDate', 'actions'];
  dataSource: MatTableDataSource<ServiceRequest>;
  availableStatuses: string[] = ['All', 'Open', 'In Progress', 'Closed'];
  selectedStatusFilter: string = 'All';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private serviceRequestService: ServiceRequestService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {
    this.dataSource = new MatTableDataSource<ServiceRequest>();
  }

  ngOnInit(): void {
    this.loadServiceRequests();
  }

  loadServiceRequests(): void {
    const filter = this.selectedStatusFilter === 'All' ? undefined : this.selectedStatusFilter;
    this.serviceRequestService.getServiceRequests(filter).subscribe({
      next: (requests) => {
        this.dataSource.data = requests;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.snackBar.open(`Error loading requests: ${err.message}`, 'Close', { duration: 5000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onStatusFilterChange(): void {
    this.loadServiceRequests();
  }

  viewRequest(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/requests', id]);
    }
  }

  editRequest(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/requests/edit', id]);
    }
  }

  deleteRequest(id: number | undefined): void {
    if (!id) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: 'Are you sure you want to delete this service request?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceRequestService.deleteServiceRequest(id).subscribe({
          next: () => {
            this.snackBar.open('Request deleted successfully!', 'Close', { duration: 3000 });
            this.loadServiceRequests(); // Reload data after deletion
          },
          error: (err) => {
            this.snackBar.open(`Error deleting request: ${err.message}`, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
