import { TestBed } from '@angular/core/testing';

import { DetailsDetailsService } from './details-details.service';

describe('DetailsDetailsService', () => {
  let service: DetailsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
