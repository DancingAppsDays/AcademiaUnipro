import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostponementPolicyComponent } from './postponement-policy.component';

describe('PostponementPolicyComponent', () => {
  let component: PostponementPolicyComponent;
  let fixture: ComponentFixture<PostponementPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostponementPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostponementPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
