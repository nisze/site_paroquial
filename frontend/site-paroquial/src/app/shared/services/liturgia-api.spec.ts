import { TestBed } from '@angular/core/testing';

import { LiturgiaApi } from './liturgia-api';

describe('LiturgiaApi', () => {
  let service: LiturgiaApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiturgiaApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
