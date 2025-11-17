import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Noticias } from './noticias';

describe('Noticias', () => {
  let component: Noticias;
  let fixture: ComponentFixture<Noticias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Noticias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Noticias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
