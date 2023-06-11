import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongViewDashboardComponent } from './song-view-dashboard.component';

describe('SongViewDashboardComponent', () => {
  let component: SongViewDashboardComponent;
  let fixture: ComponentFixture<SongViewDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongViewDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongViewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
