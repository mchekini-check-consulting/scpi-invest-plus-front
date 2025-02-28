import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScpiDialogComponent } from './add-scpi-dialog.component';

describe('AddScpiDialogComponent', () => {
  let component: AddScpiDialogComponent;
  let fixture: ComponentFixture<AddScpiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddScpiDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddScpiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
