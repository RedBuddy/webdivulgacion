import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../../../core/services/article.service';
import { ArticleCoauthorService } from '../../../../../core/services/article-coauthor.service';
import { Article } from '../../../../../core/models/article.model';
import { ICoauthor } from '../../../../../core/models/coauthor.model';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-publi-articulos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publi-articulos.component.html',
  styleUrls: ['./publi-articulos.component.scss']
})
export class PubliArticulosComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  coauthors: { [key: number]: ICoauthor[] } = {}; // Mapa de coautores por artículo
  searchControl: FormControl = new FormControl('');
  //Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math = Math;

  constructor(
    private articleService: ArticleService,
    private articleCoauthorService: ArticleCoauthorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserArticles();
    this.route.queryParams.subscribe(params => {
      const search = params['search'] || '';
      this.searchControl.setValue(search, { emitEvent: false });
      this.filterArticles(search);
      this.currentPage = 1;
    });

    this.searchControl.valueChanges.subscribe(value => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: value },
        queryParamsHandling: 'merge'
      });
      this.filterArticles(value);
    });
  }

  loadUserArticles(): void {
    this.articleService.getUserArticles().subscribe((articles) => {
      this.articles = articles;
      this.filteredArticles = articles;
      this.articles.forEach(article => {
        this.loadCoauthorsForArticle(article.id);
      });
    });
  }

  loadCoauthorsForArticle(articleId: number): void {
    this.articleCoauthorService.getArticleCoauthors(articleId).subscribe({
      next: (coauthors: ICoauthor[]) => {
        this.coauthors[articleId] = coauthors;
      },
      error: (err) => {
        console.error('Error loading coauthors for article', err);
      }
    });
  }

  filterArticles(searchText: string): void {
    if (!searchText) {
      this.filteredArticles = this.articles;
    } else {
      this.filteredArticles = this.articles.filter(article =>
        article.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  get paginatedArticles(): Article[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredArticles.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  editArticle(article: Article): void {
    // Implementar la lógica de edición aquí
  }
}
