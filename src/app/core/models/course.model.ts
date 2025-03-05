// course.model.ts
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
    imageUrl?: string; // Optional field
    featured?: boolean; // Optional field
    nextDate?: Date; // Optional field
    instructor: Instructor;
    availableDates: Date[];
  }
  
  // instructor.model.ts
  export interface Instructor {
    id: string;
    name: string;
    photoUrl: string;
    bio: string;
    specialties: string[];
  }