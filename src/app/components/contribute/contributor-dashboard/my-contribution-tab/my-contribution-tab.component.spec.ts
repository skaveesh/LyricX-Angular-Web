import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContributionTabComponent } from './my-contribution-tab.component';

describe('MyContributionTabComponent', () => {
  let component: MyContributionTabComponent;
  let fixture: ComponentFixture<MyContributionTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyContributionTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyContributionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
