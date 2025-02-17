import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMulticriteriaComponent } from './search-multicriteria.component';

describe('SearhMulticriteriaComponent', () => {
  let component: SearchMulticriteriaComponent;
  let fixture: ComponentFixture<SearchMulticriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMulticriteriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchMulticriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
