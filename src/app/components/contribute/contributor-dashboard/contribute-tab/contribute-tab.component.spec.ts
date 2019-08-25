import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributeTabComponent } from './contribute-tab.component';

describe('ContributeTabComponent', () => {
  let component: ContributeTabComponent;
  let fixture: ComponentFixture<ContributeTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributeTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
