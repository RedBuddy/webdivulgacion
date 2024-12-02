import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FitroService } from '../../services/fitro.service';
import { ArticleCategoryService } from '../../../../core/services/article-category.service';
import { CategoryService } from '../../../../core/services/category.service';
import { User_filter } from '../../../../core/models/user_filter.model';
import { Article } from '../../../../core/models/article.model';
import { ICategory } from '../../../../core/models/category.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})
export class FiltroComponent implements OnInit {
  searchText: string | null = null;
  filteredUsers: User_filter[] = [];
  filteredArticles: Article[] = [];
  categories: { [key: number]: ICategory[] } = {}; // Mapa de categorías por artículo
  categoryMap: { [key: number]: ICategory } = {}; // Mapa de categorías por ID
  errorMessage: string | null = null;
  searchControl: FormControl = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fitroService: FitroService,
    private articleCategoryService: ArticleCategoryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadAllCategories();

    this.route.paramMap.subscribe(params => {
      this.searchText = params.get('texto');
      if (this.searchText) {
        this.searchControl.setValue(this.searchText, { emitEvent: false });
        this.filterUsers(this.searchText);
        this.filterArticles(this.searchText);
      }
    });

    this.searchControl.valueChanges.subscribe(value => {
      this.router.navigate(['/home/filtrar', value]);
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
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error filtering users', err);
        this.errorMessage = 'Error al filtrar los usuarios';
        this.clearUsers();
      }
    });
  }

  filterArticles(searchString: string): void {
    this.fitroService.filterArticles(searchString).subscribe({
      next: (articles: Article[]) => {
        this.filteredArticles = articles;
        this.filteredArticles.forEach(article => {
          this.loadCategoriesForArticle(article.id);
        });
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error filtering articles', err);
        this.errorMessage = 'Error al filtrar los artículos';
        this.clearArticles();
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

  clearUsers(): void {
    this.filteredUsers = [];
  }

  clearArticles(): void {
    this.filteredArticles = [];
  }

}
