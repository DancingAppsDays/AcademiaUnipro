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
    console.log(`Fetching course dates for courseId: ${courseId} from ${this.apiUrl}/course/${courseId}`);
    
    // Try getting from actual API first
    return this.http.get<any[]>(`${this.apiUrl}/course/${courseId}`).pipe(
      tap(data => console.log(`Retrieved ${data.length} course dates from API for course ${courseId}:`, data)),
      // Map the response to ensure dates are properly handled
      map(dates => this.normalizeCourseDates(dates)),
      catchError(error => {
        console.error(`Error fetching course dates from API for course ${courseId}:`, error);
        // Only fall back to mock data if we've enabled it
        return this.getMockCourseInstances(courseId);
      })
    );
  }
  
  getCourseInstanceById(instanceId: string): Observable<CourseDate | null> {
    console.log(`Fetching course date by id: ${instanceId} from ${this.apiUrl}/${instanceId}`);
    
    // Try getting from actual API first
    return this.http.get<any>(`${this.apiUrl}/${instanceId}`).pipe(
      tap(data => console.log(`Retrieved course date ${instanceId} from API:`, data)),
      // Normalize the date fields
      map(date => this.normalizeCourseDate(date)),
      catchError(error => {
        console.error(`Error fetching course date from API for id ${instanceId}:`, error);
        return this.getMockCourseInstanceById(instanceId);
      })
    );
  }
  
  getUpcomingInstancesLEGaSCY(limit: number = 10): Observable<CourseDate[]> {
    //console.log(`Fetching upcoming course dates with limit ${limit} from ${this.apiUrl}/upcoming?limit=${limit}`);
    
    // Try getting from actual API first
    return this.http.get<any[]>(`${this.apiUrl}/upcoming?limit=${limit}`).pipe(
      tap(data => console.log(`Retrieved ${data.length} upcoming course dates from API:`, data)),
      // Map the response to ensure dates are properly handled
      map(dates => this.normalizeCourseDates(dates)),
      catchError(error => {
        console.error('Error fetching upcoming course dates from API:', error);
        return of(MOCK_COURSE_INSTANCES.slice(0, limit));
      })
    );
  }
  
  // Helper method to normalize date fields in course dates from API
  private normalizeCourseDates(dates: any[]): CourseDate[] {
    if (!dates || !Array.isArray(dates)) {
      console.warn('Received invalid or empty course dates array');
      return [];
    }
    
    return dates.map(date => this.normalizeCourseDate(date)).filter((date): date is CourseDate => date !== null);
  }
  
  private normalizeCourseDate(date: any): CourseDate | null {
    if (!date) {
      console.warn('Received invalid course date object');
      return null;
    }
    
    // Ensure course ID is correctly extracted
    const courseId = date.course?._id || date.course?.id || date.course || '';
    
    return {
      _id: date._id || date.id,
      courseId: courseId,
      startDate: date.startDate,
      endDate: date.endDate,
      capacity: date.capacity || 0,
      enrolledCount: date.enrolledCount || 0,
      instructor: {
        _id: date.instructor?.id || date.instructor?._id || '',
        name: date.instructor?.name || 'Instructor',
        photoUrl: date.instructor?.photoUrl || 'assets/images/instructors/default.png'
      },
      location: date.location || 'Virtual',
      meetingUrl: date.meetingUrl,
      whatsappGroup: date.whatsappGroup, 
      status: date.status || 'scheduled',
      minimumRequired: date.minimumRequired || 6
    };
  }
  
  enrollInCourseInstance(instanceId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${instanceId}/enroll`, { userId }).pipe(
      tap(response => console.log('Enrollment response from API:', response)),
      catchError(error => {
        console.error('Error enrolling in course through API:', error);
        // For fallback during development, we'll simulate success
        if (environment.backendmockup) {
          console.log('Using mock enrollment response (development mode)');
          return of({ success: true, message: 'Enrollment successful' });
        }
        return throwError(() => error);
      })
    );
  }
  
  checkAvailability(courseDate: CourseDate): CourseDateWithAvailability {
    const availableSeats = courseDate.capacity - courseDate.enrolledCount;
    return {
      ...courseDate,
      availableSeats,
      isNearlyFull: availableSeats <= 3,
      isConfirmed: courseDate.status === 'confirmed' || courseDate.enrolledCount >= courseDate.minimumRequired,
      isAtRiskOfPostponement: 
        courseDate.status === 'scheduled' &&
        (new Date(courseDate.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 3 && 
        courseDate.enrolledCount < courseDate.minimumRequired
    };
  }
  


  getUpcomingInstances(limit: number = 10): Observable<CourseDate[]> {
    //console.log(`Fetching upcoming course dates with limit ${limit} from ${this.apiUrl}/upcoming?limit=${limit}`);
    
    // Try getting from actual API first
    return this.http.get<any[]>(`${this.apiUrl}/upcoming?limit=${limit}`).pipe(
      tap(data => console.log(`Retrieved ${data.length} upcoming course dates from API:`, data)),
      // Map the response to ensure dates are properly handled
      map(dates => this.normalizeCourseDates(dates)),
      catchError(error => {
        console.error('Error fetching upcoming course dates from API:', error);
        // If API fails, fallback to manual approach
        return this.getFallbackUpcomingInstances(limit);
      })
    );
  }

  /**
   * Fallback method for getting upcoming instances when the API endpoint fails
   * This manually filters and sorts all course dates to find upcoming ones
   */
  private getFallbackUpcomingInstances(limit: number = 10): Observable<CourseDate[]> {
    console.log('Using fallback method to get upcoming course dates');
    
    // Get current date to filter out past dates
    const now = new Date();
    
    // Get all course dates and filter manually
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map(allDates => {
        // Filter to only include future dates with status scheduled or confirmed
        const upcomingDates = this.normalizeCourseDates(allDates)
          .filter(date => {
            const startDate = new Date(date.startDate);
            return startDate > now && 
                  (date.status === 'scheduled' || date.status === 'confirmed');
          })
          // Sort by date (closest first)
          .sort((a, b) => {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          })
          // Limit to requested number
          .slice(0, limit);
        
        return upcomingDates;
      }),
      catchError(error => {
        console.error('Error in fallback method for upcoming course dates:', error);
        // If all else fails, return mock data
        return of(MOCK_COURSE_INSTANCES.slice(0, limit));
      })
    );
  }







  // Mock data methods - these will only be used if the API fails
  private getMockCourseInstances(courseId: string): Observable<CourseDate[]> {
    console.log(`Getting mock course instances for course ${courseId}`);
    const instances = MOCK_COURSE_INSTANCES.filter(instance => instance.courseId === courseId);
    return of(instances);
  }
  
  private getMockCourseInstanceById(instanceId: string): Observable<CourseDate | null> {
    console.log(`Getting mock course instance by ID: ${instanceId}`);
    const instance = MOCK_COURSE_INSTANCES.find(instance => instance._id === instanceId);
    return of(instance || null);
  }
}


// Mock course instances for testing
const MOCK_COURSE_INSTANCES: CourseDate[] = []
  // Course 1 instances
  // {
  //   id: 'inst-1',
  //   courseId: '1',
  //   startDate: new Date('2025-04-15T09:00:00'),
  //   endDate: new Date('2025-04-15T17:00:00'),
  //   capacity: 15,
  //   enrolledCount: 8,
  //   instructor: {
  //     id: '1',
  //     name: 'Roberto Vázquez',
  //     photoUrl: 'assets/images/instructors/prof2.png'
  //   },
  //   location: 'Virtual (Zoom)',
  //   meetingUrl: 'https://zoom.us/j/example1',
  //   status: 'scheduled',
  //   minimumRequired: 6
  // },
  // {
  //   id: 'inst-2',
  //   courseId: '1',
  //   startDate: new Date('2025-05-10T09:00:00'),
  //   endDate: new Date('2025-05-10T17:00:00'),
  //   capacity: 15,
  //   enrolledCount: 4,
  //   instructor: {
  //     id: '1',
  //     name: 'Roberto Vázquez',
  //     photoUrl: 'assets/images/instructors/prof2.png'
  //   },
  //   location: 'Virtual (Zoom)',
  //   meetingUrl: 'https://zoom.us/j/example2',
  //   status: 'scheduled',
  //   minimumRequired: 6
  // },
  
  // // Add a few more instances for other course IDs to ensure coverage
  // {
  //   id: 'inst-3',
  //   courseId: '2',
  //   startDate: new Date('2025-04-22T09:00:00'),
  //   endDate: new Date('2025-04-22T17:00:00'),
  //   capacity: 15,
  //   enrolledCount: 12,
  //   instructor: {
  //     id: '7',
  //     name: 'Javier Torres',
  //     photoUrl: 'assets/images/instructors/prof3.png'
  //   },
  //   location: 'Virtual (Zoom)',
  //   meetingUrl: 'https://zoom.us/j/example4',
  //   status: 'scheduled',
  //   minimumRequired: 6
  // },
  
  // // More mock instances for other course IDs
  // {
  //   id: 'inst-4',
  //   courseId: '3',
  //   startDate: new Date('2025-04-25T09:00:00'),
  //   endDate: new Date('2025-04-25T17:00:00'),
  //   capacity: 15,
  //   enrolledCount: 7,
  //   instructor: {
  //     id: '3',
  //     name: 'Carlos Mendoza',
  //     photoUrl: 'assets/images/instructors/prof1.png'
  //   },
  //   location: 'Virtual (Zoom)',
  //   meetingUrl: 'https://zoom.us/j/example6',
  //   status: 'scheduled',
  //   minimumRequired: 6
  // },
  // {
  //   id: 'inst-5',
  //   courseId: '4',
  //   startDate: new Date('2025-04-18T09:00:00'),
  //   endDate: new Date('2025-04-18T17:00:00'),
  //   capacity: 15,
  //   enrolledCount: 9,
  //   instructor: {
  //     id: '8',
  //     name: 'Eduardo Ramírez',
  //     photoUrl: 'assets/images/instructors/prof2.png'
  //   },
  //   location: 'Virtual (Zoom)',
  //   meetingUrl: 'https://zoom.us/j/example7',
  //   status: 'confirmed',
  //   minimumRequired: 6
  // }
//];