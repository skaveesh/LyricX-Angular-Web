import { TestBed } from '@angular/core/testing';

import { FormFieldsValidatingStatusService } from './form-fields-validating-status.service';

describe('FormFieldsValidatingStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormFieldsValidatingStatusService = TestBed.get(FormFieldsValidatingStatusService);
    expect(service).toBeTruthy();
  });
});
