import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LyricsviewComponent } from './lyricsview.component';

describe('LyricsviewComponent', () => {
  let component: LyricsviewComponent;
  let fixture: ComponentFixture<LyricsviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LyricsviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LyricsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
