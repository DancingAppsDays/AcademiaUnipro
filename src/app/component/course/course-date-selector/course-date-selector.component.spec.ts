import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDateSelectorComponent } from './course-date-selector.component';

describe('CourseDateSelectorComponent', () => {
  let component: CourseDateSelectorComponent;
  let fixture: ComponentFixture<CourseDateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDateSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
