import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDetialsComponent } from './details-detials.component';

describe('DetailsDetialsComponent', () => {
  let component: DetailsDetialsComponent;
  let fixture: ComponentFixture<DetailsDetialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsDetialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
