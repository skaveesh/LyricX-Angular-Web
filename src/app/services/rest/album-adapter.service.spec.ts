import { TestBed } from '@angular/core/testing';

import { AlbumAdapterService } from './album-adapter.service';

describe('AlbumAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlbumAdapterService = TestBed.get(AlbumAdapterService);
    expect(service).toBeTruthy();
  });
});
