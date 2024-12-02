import { TestBed } from '@angular/core/testing';

import { FitroService } from './fitro.service';

describe('FitroService', () => {
  let service: FitroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
