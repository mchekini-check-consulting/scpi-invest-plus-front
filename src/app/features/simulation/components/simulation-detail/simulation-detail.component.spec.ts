import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationDetailComponent } from './simulation-detail.component';

describe('SimulationDetailComponent', () => {
  let component: SimulationDetailComponent;
  let fixture: ComponentFixture<SimulationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
