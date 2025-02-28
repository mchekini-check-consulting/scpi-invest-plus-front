import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameSimulationDialogComponent } from './rename-simulation-dialog.component';

describe('RenameSimulationDialogComponent', () => {
  let component: RenameSimulationDialogComponent;
  let fixture: ComponentFixture<RenameSimulationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenameSimulationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenameSimulationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
