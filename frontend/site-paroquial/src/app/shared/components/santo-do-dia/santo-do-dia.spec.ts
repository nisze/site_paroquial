import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SantoDoDia } from './santo-do-dia';

describe('SantoDoDia', () => {
  let component: SantoDoDia;
  let fixture: ComponentFixture<SantoDoDia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SantoDoDia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SantoDoDia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
