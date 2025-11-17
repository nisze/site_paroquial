import { TestBed } from '@angular/core/testing';

import { BibliaApi } from './biblia-api';

describe('BibliaApi', () => {
  let service: BibliaApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliaApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
