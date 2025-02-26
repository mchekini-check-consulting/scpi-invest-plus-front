import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationCreatorComponent } from './simulation-creator.component';

describe('SimulationCreatorComponent', () => {
  let component: SimulationCreatorComponent;
  let fixture: ComponentFixture<SimulationCreatorComponent>;





  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
