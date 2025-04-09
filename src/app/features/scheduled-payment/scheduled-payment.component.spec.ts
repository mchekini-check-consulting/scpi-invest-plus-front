import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledPaymentComponent } from './scheduled-payment.component';

describe('ScheduledPaymentComponent', () => {
  let component: ScheduledPaymentComponent;
  let fixture: ComponentFixture<ScheduledPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
