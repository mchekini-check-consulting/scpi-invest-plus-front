import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearhMulticriteriaComponent } from './searh-multicriteria.component';

describe('SearhMulticriteriaComponent', () => {
  let component: SearhMulticriteriaComponent;
  let fixture: ComponentFixture<SearhMulticriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearhMulticriteriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearhMulticriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
