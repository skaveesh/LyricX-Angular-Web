import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongAddUpdateDashboardComponent } from './song-add-update-dashboard.component';

describe('SongAddingDashboardComponent', () => {
  let component: SongAddUpdateDashboardComponent;
  let fixture: ComponentFixture<SongAddUpdateDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongAddUpdateDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongAddUpdateDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
