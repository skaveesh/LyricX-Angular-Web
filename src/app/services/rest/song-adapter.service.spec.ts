import { TestBed } from '@angular/core/testing';

import { SongAdapterService } from './song-adapter.service';

describe('SongAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SongAdapterService = TestBed.get(SongAdapterService);
    expect(service).toBeTruthy();
  });
});
