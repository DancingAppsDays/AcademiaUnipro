import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySuccessComponent } from './company-success.component';

describe('CompanySuccessComponent', () => {
  let component: CompanySuccessComponent;
  let fixture: ComponentFixture<CompanySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
