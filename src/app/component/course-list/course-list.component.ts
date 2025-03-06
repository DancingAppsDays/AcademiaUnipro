// course-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('staggerList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  categories: string[] = ['Seguridad Industrial', 'Certificación ISO', 'Liderazgo', 'Gestión Ambiental'];
  
  selectedCategory: string | null = null;
  searchTerm: string = '';
  sortBy: 'price' | 'date' | 'title' = 'date';
  loading = true;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category');
      this.selectedCategory = category;
      this.loadCourses();
    });
  }
  
  loadCourses(): void {
    this.loading = true;
    
    //TODO: debug tool
    this.courseService.getMockCourses().subscribe(courses => {
      this.courses = courses;
      this.applyFilters();
      console.log('Mock courses loaded', courses);
      this.loading = false;
    });
    
    this.courseService.getAllCourses().subscribe({
      next: (coursess) => {
        //this.courses = courses;
        this.applyFilters();
        console.log('Courses loaded normal', coursess);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses', error);
        
        // Fallback to mock data
        this.courseService.getMockCourses().subscribe(courses => {
          this.courses = courses;
          this.applyFilters();
          console.log('Mock courses loaded¨Fallback', courses);
          this.loading = false;
        });
      }
    });
  }
  
  applyFilters(): void {
    let filtered = [...this.courses];
    
    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(course => course.category === this.selectedCategory);
    }
    
    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(search) || 
        course.subtitle.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search)
      );
    }
    
     // Apply sorting
  switch (this.sortBy) {
    case 'price':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'title':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'date':
      filtered.sort((a, b) => {
        const dateA = a.nextDate ? new Date(a.nextDate).getTime() : 0;
        const dateB = b.nextDate ? new Date(b.nextDate).getTime() : 0;
        return dateA - dateB;
      });
      break;
  }
    
    this.filteredCourses = filtered;
  }
  
  changeCategory(category: string | null): void {
    this.selectedCategory = category;
    
    if (category) {
      this.router.navigate(['/courses', category]);
    } else {
      this.router.navigate(['/courses']);
    }
  }
  
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }
  
  changeSorting(sortBy: 'price' | 'date' | 'title'): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }
  
  viewCourseDetails(courseId: string): void {
    this.router.navigate(['/course', courseId]);
  }
}