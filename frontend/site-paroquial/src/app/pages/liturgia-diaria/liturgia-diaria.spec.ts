import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiturgiaDiaria } from './liturgia-diaria';

describe('LiturgiaDiaria', () => {
  let component: LiturgiaDiaria;
  let fixture: ComponentFixture<LiturgiaDiaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiturgiaDiaria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiturgiaDiaria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
