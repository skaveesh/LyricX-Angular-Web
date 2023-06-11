import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumAndAuthorAddingDashboardComponent } from './album-and-author-adding-dashboard.component';

describe('AlbumAndAuthorAddingDashboardComponent', () => {
  let component: AlbumAndAuthorAddingDashboardComponent;
  let fixture: ComponentFixture<AlbumAndAuthorAddingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumAndAuthorAddingDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumAndAuthorAddingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
