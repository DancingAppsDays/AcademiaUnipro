import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dc3InfoComponent } from './dc3-info.component';

describe('Dc3InfoComponent', () => {
  let component: Dc3InfoComponent;
  let fixture: ComponentFixture<Dc3InfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dc3InfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dc3InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
