import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuilleComponent } from './portefeuille.component';

describe('PortefeuilleComponent', () => {
  let component: PortefeuilleComponent;
  let fixture: ComponentFixture<PortefeuilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortefeuilleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortefeuilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
