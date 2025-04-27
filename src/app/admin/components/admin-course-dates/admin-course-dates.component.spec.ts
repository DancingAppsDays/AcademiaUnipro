import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCourseDatesComponent } from './admin-course-dates.component';

describe('AdminCourseDatesComponent', () => {
  let component: AdminCourseDatesComponent;
  let fixture: ComponentFixture<AdminCourseDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCourseDatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCourseDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
