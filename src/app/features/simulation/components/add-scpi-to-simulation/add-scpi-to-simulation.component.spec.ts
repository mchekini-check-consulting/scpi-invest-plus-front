import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScpiToSimulationComponent } from './add-scpi-to-simulation.component';

describe('AddScpiToSimulationComponent', () => {
  let component: AddScpiToSimulationComponent;
  let fixture: ComponentFixture<AddScpiToSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddScpiToSimulationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddScpiToSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
