import { TestBed } from '@angular/core/testing';

import { GenreAdapterService } from './genre-adapter.service';

describe('GenreAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenreAdapterService = TestBed.get(GenreAdapterService);
    expect(service).toBeTruthy();
  });
});
