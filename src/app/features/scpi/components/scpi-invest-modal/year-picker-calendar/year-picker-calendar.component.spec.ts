import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearPickerCalendarComponent } from './year-picker-calendar.component';

describe('YearPickerCalendarComponent', () => {
  let component: YearPickerCalendarComponent;
  let fixture: ComponentFixture<YearPickerCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearPickerCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearPickerCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
