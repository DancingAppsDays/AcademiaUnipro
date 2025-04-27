// src/app/admin/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`);
  }

  // Course Dates
  getCourseDates(filterDto?: any): Observable<any[]> {
    let url = `${this.apiUrl}/course-dates`;
    
    // Add query params if filter provided
    if (filterDto) {
      const params = new URLSearchParams();
      
      Object.keys(filterDto).forEach(key => {
        if (filterDto[key] !== undefined) {
          if (filterDto[key] instanceof Date) {
            params.append(key, filterDto[key].toISOString());
          } else {
            params.append(key, filterDto[key]);
          }
        }
      });
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return this.http.get<any[]>(url);
  }

  getCourseDate(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/course-dates/${id}`);
  }

  confirmCourseDate(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/course-dates/${id}/confirm`, {});
  }

  postponeCourseDate(id: string, newDate: Date, reason: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/course-dates/${id}/postpone`, {
      newDate,
      reason
    });
  }

  cancelCourseDate(id: string, reason: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/course-dates/${id}/cancel`, {
      reason
    });
  }

  completeCourseDate(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/course-dates/${id}/complete`, {});
  }

  checkPostponementStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check-postponement`);
  }

  // Enrollments
  getEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enrollments`);
  }

  getEnrollment(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/enrollments/${id}`);
  }

  getCourseEnrollments(courseDateId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/course-dates/${courseDateId}/enrollments`);
  }
}