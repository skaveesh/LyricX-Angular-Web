import { TestBed } from '@angular/core/testing';

import { LoginAccessoryService } from './login-accessory.service';

describe('LoginAccessoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginAccessoryService = TestBed.get(LoginAccessoryService);
    expect(service).toBeTruthy();
  });
});
