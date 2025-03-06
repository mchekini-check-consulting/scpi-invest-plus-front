import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiInvestModalComponent } from './scpi-invest-modal.component';

describe('ScpiInvestModalComponent', () => {
  let component: ScpiInvestModalComponent;
  let fixture: ComponentFixture<ScpiInvestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiInvestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiInvestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
