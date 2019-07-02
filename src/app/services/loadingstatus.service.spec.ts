import { TestBed } from '@angular/core/testing';

import { LoadingStatusService } from './loadingstatus.service';

describe('LoadingStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadingStatusService = TestBed.get(LoadingStatusService);
    expect(service).toBeTruthy();
  });
});
