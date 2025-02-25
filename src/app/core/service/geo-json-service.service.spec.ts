import { TestBed } from '@angular/core/testing';

import { GeoJsonServiceService } from './geo-json-service.service';

describe('GeoJsonServiceService', () => {
  let service: GeoJsonServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoJsonServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
