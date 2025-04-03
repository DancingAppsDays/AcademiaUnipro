// src/app/core/models/course-date.model.ts
export interface CourseDate {
    id: string;
    courseId: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    enrolledCount: number;
    instructor: {
      id: string;
      name: string;
      photoUrl: string;
    };
    location: string;
    meetingUrl?: string; // Zoom link
    status: 'scheduled' | 'confirmed' | 'postponed' | 'canceled' | 'completed';
    minimumRequired: number; // Minimum students required (default: 6)
  }
  
  export interface CourseDateWithAvailability extends CourseDate {
    availableSeats: number;
    isNearlyFull: boolean; // Less than 3 seats remaining
    isConfirmed: boolean; // Has met minimum enrollment
    isAtRiskOfPostponement: boolean; // Close to date but not minimum enrollment
  }