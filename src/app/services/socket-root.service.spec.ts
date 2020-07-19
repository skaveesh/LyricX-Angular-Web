import { TestBed } from '@angular/core/testing';

import { SocketRootService } from './socket-root.service';

describe('SocketRootService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketRootService = TestBed.get(SocketRootService);
    expect(service).toBeTruthy();
  });
});
