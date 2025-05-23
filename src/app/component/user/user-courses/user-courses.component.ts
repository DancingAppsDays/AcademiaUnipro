// src/app/component/user/user-courses/user-courses.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CourseDateService } from '../../../core/services/course-date.service';
import { CourseService } from '../../../core/services/course.service';
import { HttpClient } from '@angular/common/http';
import { CourseDate, CourseDateWithAvailability } from '../../../core/models/course-date.model';
import { Course } from '../../../core/models/course.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';

interface EnrolledCourse {
  id: string;
  enrollmentId: string;
  course: Course;
  instance: CourseDateWithAvailability;
  isPast: boolean;
  isUpcoming: boolean;
  isToday: boolean;
  daysUntilStart: number;
}

@Component({
  selector: 'app-user-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-courses.component.html',
  styleUrls: ['./user-courses.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class UserCoursesComponent implements OnInit {
  enrolledCourses: EnrolledCourse[] = [];
  upcomingCourses: EnrolledCourse[] = [];
  pastCourses: EnrolledCourse[] = [];
  loading = true;
  hasPostponementRisk = false;
  
  private userService = inject(UserService);
  private courseDateService = inject(CourseDateService);
  private courseService = inject(CourseService);
  private http = inject(HttpClient);
  
  ngOnInit(): void {
    this.loadUserEnrollments();
  }
  
  private loadUserEnrollments(): void {
    this.loading = true;
    
    // Get current user
    const currentUser = this.userService.getCurrentUserSync();
    if (!currentUser) {
      console.error('No user is currently logged in');
      this.loading = false;
      return;
    }
    
    // Try to get real enrollment data from API first
    const userId = currentUser._id;
    const enrollmentsUrl = `${environment.apiUrl}/enrollments/user/${userId}`;
    
    //console.log(`Fetching enrollments for user ${userId} from ${enrollmentsUrl}`);
    
    this.http.get<any[]>(enrollmentsUrl).subscribe({
      next: (enrollments) => {
        //console.log('Successfully fetched enrollments from API:', enrollments);
        if (enrollments && enrollments.length > 0) {
          this.processEnrollments(enrollments);
        } else {
          console.log('No enrollments found, falling back to mock data');
         // this.generateMockEnrollments();
        }
      },
      error: (error) => {
        //console.error('Error fetching enrollments from API:', error);
      //  console.log('Falling back to mock enrollments');
        //this.generateMockEnrollments();
      }
    });
  }
  
  private processEnrollments(enrollments: any[]): void {
    // Process real enrollment data here
    Promise.all(enrollments.map(enrollment => this.convertToEnrolledCourse(enrollment)))
      .then(enrolledCourses => {
        this.enrolledCourses = enrolledCourses.filter(Boolean) as EnrolledCourse[];
        this.splitCoursesByDate();
        this.loading = false;
      })
      .catch(error => {
        console.error('Error processing enrollments:', error);
        this.loading = false;
      });
  }
  
  private async convertToEnrolledCourse(enrollment: any): Promise<EnrolledCourse | null> {
    try {
      const courseDate = enrollment.courseDate;
      const course = courseDate.course;
      
      if (!course || !courseDate) {
        console.error('Missing course or courseDate in enrollment:', enrollment);
        return null;
      }
      
      const instanceWithAvailability = this.courseDateService.checkAvailability({
        _id: courseDate._id,
        courseId: course._id,
        startDate: courseDate.startDate,
        endDate: courseDate.endDate,
        capacity: courseDate.capacity || 15,
        enrolledCount: courseDate.enrolledCount || 0,
        instructor: courseDate.instructor || { 
          _id: '', 
          name: 'Instructor', 
          photoUrl: 'assets/images/instructors/default.png' 
        },
        location: courseDate.location || 'Virtual',
        meetingUrl: courseDate.meetingUrl,
        whatsappGroup: courseDate.whatsappGroup || null ,
        status: courseDate.status || 'scheduled',
        minimumRequired: courseDate.minimumRequired || 6
      });
      
      // Calculate days until start
      const startDate = new Date(courseDate.startDate);
      const now = new Date();
      const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: enrollment._id,
        enrollmentId: enrollment._id,
        course: course,
        instance: instanceWithAvailability,
        isPast: daysUntilStart < 0,
        isUpcoming: daysUntilStart >= 0,
        isToday: daysUntilStart === 0,
        daysUntilStart: daysUntilStart
      };
    } catch (error) {
      console.error('Error converting enrollment to enrolled course:', error);
      return null;
    }
  }
  
  private splitCoursesByDate(): void {
    const now = new Date();
    
    this.upcomingCourses = this.enrolledCourses.filter(course => {
      const startDate = new Date(course.instance.startDate);
      return startDate >= now;
    }).sort((a, b) => {
      return new Date(a.instance.startDate).getTime() - new Date(b.instance.startDate).getTime();
    });
    
    this.pastCourses = this.enrolledCourses.filter(course => {
      const startDate = new Date(course.instance.startDate);
      return startDate < now;
    }).sort((a, b) => {
      return new Date(b.instance.startDate).getTime() - new Date(a.instance.startDate).getTime();
    });
    
    // Check if any upcoming courses are at risk of postponement
    this.hasPostponementRisk = this.upcomingCourses.some(course => course.instance.isAtRiskOfPostponement);
    
    console.log('Split courses into upcoming and past:', {
      total: this.enrolledCourses.length,
      upcoming: this.upcomingCourses.length,
      past: this.pastCourses.length,
      hasRisk: this.hasPostponementRisk
    });
  }
  
  showRescheduleOptions(enrolledCourse: EnrolledCourse): void {
    alert(`En una implementación real, aquí se mostraría un modal con opciones de reprogramación para el curso: ${enrolledCourse.course.title}`);
  }
  
  private generateMockEnrollments(): void {
    this.courseDateService.getUpcomingInstances(20).subscribe(instances => {
      this.courseService.getMockCourses().subscribe(courses => {
        // Create mock enrollments
        const enrollments: EnrolledCourse[] = [];
        
        // Add 3 upcoming courses, including one at risk of postponement
        const upcomingInstances = instances.filter(instance => new Date(instance.startDate) > new Date());
        
        // Make sure at least one instance is at risk (for demo purposes)
        if (upcomingInstances.length >= 3) {
          // Modify the first instance to be at risk
          const riskInstance = { 
            ...upcomingInstances[0],
            enrolledCount: upcomingInstances[0].minimumRequired - 2 // Make it 2 short of minimum
          };
          
          const course = courses.find(c => c._id === riskInstance.courseId);
          if (course) {
            const withAvailability = this.courseDateService.checkAvailability(riskInstance);
            
            // Calculate days until start
            const startDate = new Date(riskInstance.startDate);
            const now = new Date();
            const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            // Add to enrollments
            enrollments.push({
              id: `mock-${riskInstance._id}`,
              enrollmentId: `enroll-${Math.floor(Math.random() * 10000)}`,
              course: course,
              instance: withAvailability,
              isPast: false,
              isUpcoming: true,
              isToday: false,
              daysUntilStart: daysUntilStart
            });
          }
          
          // Add 2 more upcoming courses that are not at risk
          for (let i = 1; i < Math.min(3, upcomingInstances.length); i++) {
            const instance = upcomingInstances[i];
            const course = courses.find(c => c._id === instance.courseId);
            
            if (course) {
              // Make sure this one has enough enrollments
              const confirmedInstance = {
                ...instance,
                enrolledCount: instance.minimumRequired + 2 // 2 more than minimum
              };
              
              const withAvailability = this.courseDateService.checkAvailability(confirmedInstance);
              
              // Calculate days until start
              const startDate = new Date(confirmedInstance.startDate);
              const now = new Date();
              const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              
              // Add to enrollments
              enrollments.push({
                id: `mock-${confirmedInstance._id}`,
                enrollmentId: `enroll-${Math.floor(Math.random() * 10000)}`,
                course: course,
                instance: withAvailability,
                isPast: false,
                isUpcoming: true,
                isToday: false,
                daysUntilStart: daysUntilStart
              });
            }
          }
        }
        
        // Add 2 past courses
        for (let i = 0; i < Math.min(2, courses.length); i++) {
          const course = courses[i];
          
          // Create a past instance
          const pastDate = new Date();
          pastDate.setMonth(pastDate.getMonth() - (i + 1)); // 1-2 months ago
          
          const pastInstance: CourseDate = {
            _id: `past-${i}`,
            courseId: course._id,
            startDate: pastDate,
            endDate: new Date(pastDate.getTime() + 8 * 60 * 60 * 1000), // 8 hours later
            capacity: 15,
            enrolledCount: 12,
            instructor: course.instructor,
            location: 'Virtual (Zoom)',
            meetingUrl: 'https://zoom.us/j/past-example',
            status: 'completed',
            minimumRequired: 6
          };
          
          const withAvailability = this.courseDateService.checkAvailability(pastInstance);
          
          // Add to enrollments
          enrollments.push({
            id: `mock-past-${i}`,
            enrollmentId: `enroll-past-${Math.floor(Math.random() * 10000)}`,
            course: course,
            instance: withAvailability,
            isPast: true,
            isUpcoming: false,
            isToday: false,
            daysUntilStart: -30 * (i + 1) // Negative days since it's in the past
          });
        }
        
        this.enrolledCourses = enrollments;
        this.splitCoursesByDate();
        this.loading = false;
      });
    });
  }
}