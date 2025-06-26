import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiceRequest } from '../models/service-request.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {
  private apiUrl = 'https://service-request-e4ib.onrender.com/api/ServiceRequests'; // Replace with your backend API URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('An API error occurred:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.Message) {
        errorMessage = `Server Error: ${error.error.Message}`;
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
        this.authService.logout(); // Redirect to login on 401
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  getServiceRequests(statusFilter?: string): Observable<ServiceRequest[]> {
    let params = new HttpParams();
    if (statusFilter) {
      params = params.set('statusFilter', statusFilter);
    }
    return this.http.get<ServiceRequest[]>(this.apiUrl, { headers: this.getAuthHeaders(), params: params })
      .pipe(catchError(this.handleError));
  }

  getServiceRequestById(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  createServiceRequest(request: ServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.apiUrl, request, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateServiceRequest(id: number, request: ServiceRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteServiceRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }
}