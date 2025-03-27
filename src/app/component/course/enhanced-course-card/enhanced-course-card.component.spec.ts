import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnhancedCourseCardComponent } from './enhanced-course-card.component';

describe('EnhancedCourseCardComponent', () => {
  let component: EnhancedCourseCardComponent;
  let fixture: ComponentFixture<EnhancedCourseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnhancedCourseCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnhancedCourseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
