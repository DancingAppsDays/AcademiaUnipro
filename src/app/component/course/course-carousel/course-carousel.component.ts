// course-carousel.component.ts - Fixed version
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Course } from '../../../core/models/course.model';
import { EnhancedCourseCardComponent } from '../enhanced-course-card/enhanced-course-card.component';

@Component({
  selector: 'app-course-carousel',
  standalone: true,
  imports: [CommonModule, NgbCarouselModule, EnhancedCourseCardComponent],
  templateUrl: './course-carousel.component.html',
  styleUrls: ['./course-carousel.component.scss']
})
export class CourseCarouselComponent implements OnChanges {
  @Input() courses: Course[] = [];
  @Input() subtitle: string = 'Popular Courses';
  @Input() category: string | null = null;
  
  @Output() courseSelected = new EventEmitter<Course>();
  @Output() dateSelected = new EventEmitter<{course: Course, date: Date}>();
  
  // Cached grouped courses
  private _groupedCourses: Course[][] = [];
  private _tabletGroupedCourses: Course[][] = [];
  
  // Track if courses array actually has items to prevent empty slider issues
  hasCoursesToShow = false;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courses']) {
      // Update the hasCoursesToShow flag
      this.hasCoursesToShow = this.courses && this.courses.length > 0;
      
      // Reset cached arrays
      this._groupedCourses = [];
      this._tabletGroupedCourses = [];
      
      // Re-group courses if needed
      if (this.hasCoursesToShow) {
        this._groupedCourses = this.chunkArray(this.courses, 3);
        this._tabletGroupedCourses = this.chunkArray(this.courses, 2);
      }
    }
  }
  
  get groupedCourses(): Course[][] {
    return this._groupedCourses;
  }
  
  get tabletGroupedCourses(): Course[][] {
    return this._tabletGroupedCourses;
  }
  
  // Group courses into chunks for carousel slides
  private chunkArray(array: any[], size: number): any[][] {
    if (!array || array.length === 0) {
      return []; // Return empty array if input is empty
    }
    
    // Handle special cases for small arrays by repeating courses
    if (array.length === 1) {
      // For a single course, repeat it to fill the slide
      return [[array[0], array[0], array[0]]];
    }
    
    if (array.length === 2) {
      // For two courses, repeat to fill a slide of 3
      // [1,2,1]
      return [[array[0], array[1], array[0]]];
    }
    
    // If array length equals size, return as a single chunk
    if (array.length === size) {
      return [array];
    }
    
    // For arrays with more than 'size' elements, create continuous looping slides
    const chunked = [];
    const totalItems = array.length;
    
    // Decide number of slides: for 4+ courses, always create at least 3 slides for better UX
    const slidesNeeded = Math.max(3, Math.ceil(totalItems / size));
    
    for (let slideIndex = 0; slideIndex < slidesNeeded; slideIndex++) {
      const chunk = [];
      
      // Fill each chunk with 'size' items, wrapping around when needed
      for (let itemIndex = 0; itemIndex < size; itemIndex++) {
        // Calculate position in original array, using modulo to wrap around
        const arrayIndex = (slideIndex * size + itemIndex) % totalItems;
        chunk.push(array[arrayIndex]);
      }
      
      chunked.push(chunk);
    }
    
    return chunked;
  }
  
  onCourseSelected(course: Course): void {
    this.courseSelected.emit(course);
  }
  
  onDateSelected(event: {course: Course, date: Date}): void {
    this.dateSelected.emit(event);
  }
}