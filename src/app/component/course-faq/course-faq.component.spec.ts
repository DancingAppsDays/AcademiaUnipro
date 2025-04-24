import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFaqComponent } from './course-faq.component';

describe('CourseFaqComponent', () => {
  let component: CourseFaqComponent;
  let fixture: ComponentFixture<CourseFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFaqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
