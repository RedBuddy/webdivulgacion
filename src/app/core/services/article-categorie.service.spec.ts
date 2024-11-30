import { TestBed } from '@angular/core/testing';

import { ArticleCategorieService } from './article-categorie.service';

describe('ArticleCategorieService', () => {
  let service: ArticleCategorieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleCategorieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
