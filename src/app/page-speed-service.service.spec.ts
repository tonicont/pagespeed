import { TestBed } from '@angular/core/testing';

import { PageSpeedServiceService } from './page-speed-service.service';

describe('PageSpeedServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageSpeedServiceService = TestBed.get(PageSpeedServiceService);
    expect(service).toBeTruthy();
  });
});
