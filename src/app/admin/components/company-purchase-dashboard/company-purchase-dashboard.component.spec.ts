import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPurchaseDashboardComponent } from './company-purchase-dashboard.component';

describe('CompanyPurchaseDashboardComponent', () => {
  let component: CompanyPurchaseDashboardComponent;
  let fixture: ComponentFixture<CompanyPurchaseDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyPurchaseDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPurchaseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
