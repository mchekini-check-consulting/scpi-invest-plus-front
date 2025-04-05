import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectScpiComponent } from './select-scpi.component';

describe('SelectScpiComponent', () => {
  let component: SelectScpiComponent;
  let fixture: ComponentFixture<SelectScpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectScpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectScpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
