import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCheckoutComponent } from './quick-checkout.component';

describe('QuickCheckoutComponent', () => {
  let component: QuickCheckoutComponent;
  let fixture: ComponentFixture<QuickCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
