import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToplyricsComponent } from './toplyrics.component';

describe('ToplyricsComponent', () => {
  let component: ToplyricsComponent;
  let fixture: ComponentFixture<ToplyricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToplyricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToplyricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
