import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FitroService } from '../../services/fitro.service';
import { ArticleCategoryService } from '../../../../core/services/article-category.service';
import { CategoryService } from '../../../../core/services/category.service';
import { ArticleCoauthorService } from '../../../../core/services/article-coauthor.service';
import { ArticleService } from '../../../../core/services/article.service';
import { User_filter } from '../../../../core/models/user_filter.model';
import { Article } from '../../../../core/models/article.model';
import { ICategory } from '../../../../core/models/category.model';
import { ICoauthor } from '../../../../core/models/coauthor.model';
import { Author } from '../../../../core/models/author.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})

export class FiltroComponent implements OnInit {
  searchText: string | null = null;
  filteredUsers: User_filter[] = [];
  filteredArticles: Article[] = [];
  paginatedUsers: User_filter[] = [];
  paginatedArticles: Article[] = [];

  coauthors: { [key: number]: ICoauthor[] } = {};
  categories: { [key: number]: ICategory[] } = {};
  categoryMap: { [key: number]: ICategory } = {};
  authors: { [key: number]: Author } = {};
  errorMessage: string | null = null;
  showingArticles: boolean = true;
  showingUsers: boolean = false;

  Math = Math;

  searchControl: FormControl = new FormControl('');
  sortControl: FormControl = new FormControl('recent');

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fitroService: FitroService,
    private articleCategoryService: ArticleCategoryService,
    private categoryService: CategoryService,
    private articleCoauthorService: ArticleCoauthorService,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    // this.loadAllCategories();

    this.route.paramMap.subscribe(params => {
      this.searchText = params.get('texto');
      if (this.searchText) {
        this.searchControl.setValue(this.searchText, { emitEvent: false });
        this.filterUsers(this.searchText);
        this.filterArticles(this.searchText);
        this.sortControl.valueChanges.subscribe(value => {
          this.sortArticles(value);
        });
      }
    });
  }



  loadAllCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: ICategory[]) => {
        this.categoryMap = categories.reduce((map, category) => {
          map[category.id] = category;
          return map;
        }, {} as { [key: number]: ICategory });
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });
  }

  filterUsers(searchString: string): void {
    this.fitroService.filterUsers(searchString).subscribe({
      next: (users: User_filter[]) => {
        this.filteredUsers = users;
        this.paginateUsers();
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error filtering users', err);
        this.errorMessage = 'Error al filtrar los usuarios';
        this.clearResults();
      }
    });
  }

  filterArticles(searchString: string): void {
    this.fitroService.filterArticles(searchString).subscribe({
      next: (articles: Article[]) => {
        this.filteredArticles = articles.filter(article => article.status !== 'archived');
        this.filteredArticles.forEach(article => {
          // this.loadCategoriesForArticle(article.id);
          this.loadCoauthorsForArticle(article.id);
          this.loadAuthorForArticle(article.id);
        });
        this.sortArticles(this.sortControl.value); // Ordenar artículos al cargar
        this.paginateArticles();
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error filtering articles', err);
        this.errorMessage = 'Error al filtrar los artículos';
        this.clearResults();
      }
    });
  }

  loadCategoriesForArticle(articleId: number): void {
    this.articleCategoryService.getArticleCategories(articleId).subscribe({
      next: (response: { id_article: number, id_categories: number[] }) => {
        this.categories[articleId] = response.id_categories.map(id => this.categoryMap[id]);
      },
      error: (err) => {
        console.error('Error loading categories for article', err);
      }
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

  loadAuthorForArticle(articleId: number): void {
    this.articleService.getAuthorByArticleId(articleId).subscribe({
      next: (author: Author) => {
        this.authors[articleId] = author;
      },
      error: (err) => {
        console.error('Error loading author for article', err);
      }
    });
  }

  sortArticles(sortOption: string): void {
    if (sortOption === 'recent') {
      this.filteredArticles.sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());
    } else if (sortOption === 'oldest') {
      this.filteredArticles.sort((a, b) => new Date(a.publication_date).getTime() - new Date(b.publication_date).getTime());
    }
    this.paginateArticles();
  }

  clearResults(): void {
    this.filteredUsers = [];
    this.filteredArticles = [];
    this.paginatedUsers = [];
    this.paginatedArticles = [];
  }

  showArticles(): void {
    this.showingArticles = true;
    this.showingUsers = false;
    this.currentPage = 1;
  }

  showUsers(): void {
    this.showingArticles = false;
    this.showingUsers = true;
    this.currentPage = 1;
  }

  search(): void {
    if (this.searchText) {
      this.filterArticles(this.searchText);
      this.filterUsers(this.searchText);
    }
  }

  paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  paginateArticles(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedArticles = this.filteredArticles.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    if (this.showingArticles) {
      this.paginateArticles();
    } else {
      this.paginateUsers();
    }
  }

  viewProfile(userId: string): void {
    this.router.navigate(['/perfil', userId]);
  }

  viewArticle(articleId: string): void {
    this.router.navigate(['/articulo', articleId]);
  }
}
