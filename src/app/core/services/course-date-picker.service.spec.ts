import { TestBed } from '@angular/core/testing';

import { CourseDatePickerService } from './course-date-picker.service';

describe('CourseDatePickerService', () => {
  let service: CourseDatePickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseDatePickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
