import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioLiturgico } from './calendario-liturgico';

describe('CalendarioLiturgico', () => {
  let component: CalendarioLiturgico;
  let fixture: ComponentFixture<CalendarioLiturgico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioLiturgico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioLiturgico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
