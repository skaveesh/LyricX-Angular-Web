import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongAddingDashboardComponent } from './song-adding-dashboard.component';

describe('SongAddingDashboardComponent', () => {
  let component: SongAddingDashboardComponent;
  let fixture: ComponentFixture<SongAddingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongAddingDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongAddingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
