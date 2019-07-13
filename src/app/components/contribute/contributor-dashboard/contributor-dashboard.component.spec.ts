import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorDashboardComponent } from './contributor-dashboard.component';

describe('ContributorDashboardComponent', () => {
  let component: ContributorDashboardComponent;
  let fixture: ComponentFixture<ContributorDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributorDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
