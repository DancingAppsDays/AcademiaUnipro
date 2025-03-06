import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDatePickerComponent } from './course-date-picker.component';

describe('CourseDatePickerComponent', () => {
  let component: CourseDatePickerComponent;
  let fixture: ComponentFixture<CourseDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDatePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
