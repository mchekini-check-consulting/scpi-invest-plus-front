import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScpiHistoryDetailsComponent } from '../scpi-history-details.component';

describe('ScpiHistoryDetailsComponent', () => {
  let component: ScpiHistoryDetailsComponent;
  let fixture: ComponentFixture<ScpiHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScpiHistoryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScpiHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
