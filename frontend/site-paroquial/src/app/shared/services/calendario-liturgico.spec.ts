import { TestBed } from '@angular/core/testing';

import { CalendarioLiturgico } from './calendario-liturgico';

describe('CalendarioLiturgico', () => {
  let service: CalendarioLiturgico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarioLiturgico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
