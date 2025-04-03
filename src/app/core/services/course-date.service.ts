// src/app/core/services/course-date.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CourseDate, CourseDateWithAvailability } from '../models/course-date.model';

@Injectable({
  providedIn: 'root'
})
export class CourseDateService {
  private apiUrl = `${environment.apiUrl}/course-dates`;
  private http = inject(HttpClient);
  
  getCourseInstancesForCourse(courseId: string): Observable<CourseDate[]> {
    // In real implementation, call the API
    // return this.http.get<CourseDate[]>(`${this.apiUrl}/course/${courseId}`);
    
    // For now, use mock data
    return this.getMockCourseInstances(courseId);
  }
  
  getCourseInstanceById(instanceId: string): Observable<CourseDate | null> {
    // In real implementation, call the API
    // return this.http.get<CourseDate>(`${this.apiUrl}/${instanceId}`);
    
    // For now, use mock data
    return this.getMockCourseInstanceById(instanceId);
  }
  
  getUpcomingInstances(limit: number = 10): Observable<CourseDate[]> {
    // In real implementation, call the API
    // return this.http.get<CourseDate[]>(`${this.apiUrl}/upcoming?limit=${limit}`);
    
    // For now, use mock data
    return of(MOCK_COURSE_INSTANCES.slice(0, limit));
  }
  
  enrollInCourseInstance(instanceId: string, userId: string): Observable<any> {
    // In real implementation, call the API
    // return this.http.post(`${this.apiUrl}/${instanceId}/enroll`, { userId });
    
    // For now, return mock success
    return of({ success: true, message: 'Enrollment successful' });
  }
  
  checkAvailability(courseDate: CourseDate): CourseDateWithAvailability {
    const availableSeats = courseDate.capacity - courseDate.enrolledCount;
    return {
      ...courseDate,
      availableSeats,
      isNearlyFull: availableSeats <= 3,
      isConfirmed: courseDate.enrolledCount >= courseDate.minimumRequired,
      isAtRiskOfPostponement: 
        (new Date(courseDate.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 3 && 
        courseDate.enrolledCount < courseDate.minimumRequired
    };
  }
  
  // Mock data methods
  private getMockCourseInstances(courseId: string): Observable<CourseDate[]> {
    const instances = MOCK_COURSE_INSTANCES.filter(instance => instance.courseId === courseId);
    return of(instances);
  }
  
  private getMockCourseInstanceById(instanceId: string): Observable<CourseDate | null> {
    const instance = MOCK_COURSE_INSTANCES.find(instance => instance.id === instanceId);
    return of(instance || null);
  }
}

// Mock course instances for testing
const MOCK_COURSE_INSTANCES: CourseDate[] = [
  // Course 1 instances (NOM-004-STPS)
  {
    id: 'inst-1',
    courseId: '1',
    startDate: new Date('2025-04-15T09:00:00'),
    endDate: new Date('2025-04-15T17:00:00'),
    capacity: 15,
    enrolledCount: 8,
    instructor: {
      id: '1',
      name: 'Roberto Vázquez',
      photoUrl: 'assets/images/instructors/prof2.png'
    },
    location: 'Virtual (Zoom)',
    meetingUrl: 'https://zoom.us/j/example1',
    status: 'scheduled',
    minimumRequired: 6
  },
  {
    id: 'inst-2',
    courseId: '1',
    startDate: new Date('2025-05-10T09:00:00'),
    endDate: new Date('2025-05-10T17:00:00'),
    capacity: 15,
    enrolledCount: 4,
    instructor: {
      id: '1',
      name: 'Roberto Vázquez',
      photoUrl: 'assets/images/instructors/prof2.png'
    },
    location: 'Virtual (Zoom)',
    meetingUrl: 'https://zoom.us/j/example2',
    status: 'scheduled',
    minimumRequired: 6
  },
  {
    id: 'inst-3',
    courseId: '1',
    startDate: new Date('2025-06-05T09:00:00'),
    endDate: new Date('2025-06-05T17:00:00'),
    capacity: 15,
    enrolledCount: 14,
    instructor: {
      id: '7',
      name: 'Javier Torres',
      photoUrl: 'assets/images/instructors/prof3.png'
    },
    location: 'Virtual (Zoom)',
    meetingUrl: 'https://zoom.us/j/example3',
    status: 'scheduled',
    minimumRequired: 6
  },
  
  // Course 2 instances (NOM-018-STPS)
  {
    id: 'inst-4',
    courseId: '2',
    startDate: new Date('2025-04-22T09:00:00'),
    endDate: new Date('2025-04-22T17:00:00'),
    capacity: 15,
    enrolledCount: 12,
    instructor: {
      id: '7',
      name: 'Javier Torres',
      photoUrl: 'assets/images/instructors/prof3.png'
    },
    location: 'Virtual (Zoom)',
    meetingUrl: 'https://zoom.us/j/example4',
    status: 'scheduled',
    minimumRequired: 6
  },
  {
    id: 'inst-5',
    courseId: '2',
    startDate: new Date('2025-05-18T09:00:00'),
    endDate: new Date('2025-05-18T17:00:00'),
    capacity: 15,
    enrolledCount: 5,
    instructor: {
      id: '7',
      name: 'Javier Torres',
      photoUrl: 'assets/images/instructors/prof3.png'
    },
    location: 'Virtual (Zoom)',
    meetingUrl: 'https://zoom.us/j/example5',
    status: 'scheduled',
    minimumRequired: 6
  },
  
  // Add more instances for other courses as needed
];