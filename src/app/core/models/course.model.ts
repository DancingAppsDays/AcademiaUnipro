// src/app/core/models/course.model.ts
import { CourseDate } from './course-date.model';

export interface Course {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    category: string;
    price: number;
    duration: string;
    isoStandards: string[];
    previewVideoUrl: string;
    imageUrl?: string;
    featured?: boolean;
    instructor: Instructor;
    
    // The following fields are for backward compatibility
    nextDate?: Date;
    availableDates: Date[];
    
    // New field to reference specific course instances
    courseInstances?: CourseDate[];
    
    // Course policy details
    postponementPolicy?: {
      minimumRequired: number;
      deadlineDays: number;
      message: string;
    };
}
  
export interface Instructor {
    id: string;
    name: string;
    photoUrl: string;
    bio: string;
    specialties: string[];
}