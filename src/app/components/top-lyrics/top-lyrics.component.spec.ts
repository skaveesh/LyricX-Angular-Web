import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopLyricsComponent } from './top-lyrics.component';

describe('TopLyricsComponent', () => {
  let component: TopLyricsComponent;
  let fixture: ComponentFixture<TopLyricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopLyricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopLyricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
