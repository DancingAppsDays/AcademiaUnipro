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
    
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    
    // Make sure we have at least one chunk
    if (chunked.length === 0) {
      chunked.push([]);
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