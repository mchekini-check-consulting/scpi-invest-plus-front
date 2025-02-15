import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsGlobalViewComponent } from './details-global-view.component';

describe('DetailsGlobalViewComponent', () => {
  let component: DetailsGlobalViewComponent;
  let fixture: ComponentFixture<DetailsGlobalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsGlobalViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsGlobalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
