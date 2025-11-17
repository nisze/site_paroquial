import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetTempoLiturgico } from './widget-tempo-liturgico';

describe('WidgetTempoLiturgico', () => {
  let component: WidgetTempoLiturgico;
  let fixture: ComponentFixture<WidgetTempoLiturgico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetTempoLiturgico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetTempoLiturgico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
