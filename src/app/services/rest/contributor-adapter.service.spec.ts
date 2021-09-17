import { TestBed } from '@angular/core/testing';

import { ContributorAdapterService } from './contributor-adapter.service';

describe('ContributorAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContributorAdapterService = TestBed.get(ContributorAdapterService);
    expect(service).toBeTruthy();
  });
});
