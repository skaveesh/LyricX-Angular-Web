import { TestBed } from '@angular/core/testing';

import { ContributorUtilService } from './contributor-util.service';

describe('ContributorUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContributorUtilService = TestBed.get(ContributorUtilService);
    expect(service).toBeTruthy();
  });
});
