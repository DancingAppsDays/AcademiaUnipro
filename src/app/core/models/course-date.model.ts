// src/app/core/models/course-date.model.ts
export type CourseDateStatus = 'scheduled' | 'confirmed' | 'postponed' | 'canceled' | 'completed';

export interface CourseDate {
  _id: string;
  courseId: string;
  startDate: Date | string; // Accept both Date object and ISO string
  endDate: Date | string;   // Accept both Date object and ISO string
  capacity: number;
  enrolledCount: number;
  instructor: {
    _id: string;
    name: string;
    photoUrl: string;
  };
  instructorOverride?: string; // Optional override for instructor service
  location: string;
  meetingUrl?: string; // Zoom link
  whatsappGroup?: string;
  status: 'scheduled' | 'confirmed' | 'postponed' | 'canceled' | 'completed';
  minimumRequired: number; // Minimum students required (default: 6)
}

export interface CourseDateWithAvailability extends CourseDate {
  availableSeats: number;
  isNearlyFull: boolean; // Less than 3 seats remaining
  isConfirmed: boolean; // Has met minimum enrollment
  isAtRiskOfPostponement: boolean; // Close to date but not minimum enrollment
}