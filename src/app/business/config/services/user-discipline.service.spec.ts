import { TestBed } from '@angular/core/testing';

import { UserDisciplineService } from './user-discipline.service';

describe('UserDisciplineService', () => {
  let service: UserDisciplineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDisciplineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
