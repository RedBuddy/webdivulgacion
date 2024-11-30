import { TestBed } from '@angular/core/testing';

import { ArticleCoauthorService } from './article-coauthor.service';

describe('ArticleCoauthorService', () => {
  let service: ArticleCoauthorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleCoauthorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
