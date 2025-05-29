import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnhacedInstructorDisplayComponent } from './enhaced-instructor-display.component';

describe('EnhacedInstructorDisplayComponent', () => {
  let component: EnhacedInstructorDisplayComponent;
  let fixture: ComponentFixture<EnhacedInstructorDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnhacedInstructorDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnhacedInstructorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
