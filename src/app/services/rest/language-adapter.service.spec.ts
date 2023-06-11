import { TestBed } from '@angular/core/testing';

import { LanguageAdapterService } from './language-adapter.service';

describe('LanguageAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LanguageAdapterService = TestBed.get(LanguageAdapterService);
    expect(service).toBeTruthy();
  });
});
