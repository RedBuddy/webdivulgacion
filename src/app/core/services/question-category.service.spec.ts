import { TestBed } from '@angular/core/testing';

import { QuestionCategoryService } from './question-category.service';

describe('QuestionCategoryService', () => {
  let service: QuestionCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
