import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScpiToSimulationDialogComponent } from './add-scpi-to-simulation-dialog.component';

describe('AddScpiToSimulationDialogComponent', () => {
  let component: AddScpiToSimulationDialogComponent;
  let fixture: ComponentFixture<AddScpiToSimulationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddScpiToSimulationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddScpiToSimulationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
