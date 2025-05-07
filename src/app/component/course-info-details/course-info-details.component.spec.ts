import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseInfoDetailsComponent } from './course-info-details.component';

describe('CourseInfoDetailsComponent', () => {
  let component: CourseInfoDetailsComponent;
  let fixture: ComponentFixture<CourseInfoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseInfoDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
