import { TestBed } from '@angular/core/testing';

import { CourseDateService } from './course-date.service';

describe('CourseDateService', () => {
  let service: CourseDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
