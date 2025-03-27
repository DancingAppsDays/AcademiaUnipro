import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomereComponent } from './homere.component';

describe('HomereComponent', () => {
  let component: HomereComponent;
  let fixture: ComponentFixture<HomereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
