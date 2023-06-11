import { TestBed } from '@angular/core/testing';

import { ArtistAdapterService } from './artist-adapter.service';

describe('ArtistAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArtistAdapterService = TestBed.get(ArtistAdapterService);
    expect(service).toBeTruthy();
  });
});
