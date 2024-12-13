import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../../core/services/article.service';
import { ArticleCoauthorService } from '../../../../core/services/article-coauthor.service';
import { ArticleCategoryService } from '../../../../core/services/article-category.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Article } from '../../../../core/models/article.model';
import { ICoauthor } from '../../../../core/models/coauthor.model';
import { ICategory } from '../../../../core/models/category.model';
import { Author } from '../../../../core/models/author.model';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})

export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  selectedCategory: string = 'all';
  coauthors: { [key: number]: ICoauthor[] } = {}; // Mapa de coautores por artículo
  categories: { [key: number]: ICategory[] } = {}; // Mapa de categorías por artículo
  categoryMap: { [key: number]: ICategory } = {}; // Mapa de categorías por ID
  authors: { [key: number]: Author } = {}; // Mapa de autores por artículo
  searchControl: FormControl = new FormControl('');
  sortControl: FormControl = new FormControl('recent'); // Control para el select de ordenamiento
  categorySearchControl: FormControl = new FormControl(''); // Control para el cuadro de búsqueda de categoría
  filteredCategories: ICategory[] = [];
  isCategorySearchFocused: boolean = false; // Variable para rastrear el enfoque del cuadro de búsqueda de categorías
  //Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math = Math;

  constructor(
    private articleService: ArticleService,
    private articleCoauthorService: ArticleCoauthorService,
    private articleCategoryService: ArticleCategoryService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllCategories();
    this.loadAllArticles();
    this.searchControl.valueChanges.subscribe(value => {
      this.filterArticles();
    });
    this.sortControl.valueChanges.subscribe(value => {
      this.sortArticles(value);
    });
    this.categorySearchControl.valueChanges.subscribe(value => {
      this.filterCategories(value);
      this.filterArticles();
    });
  }

  loadAllCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: ICategory[]) => {
        this.categoryMap = categories.reduce((map, category) => {
          map[category.id] = category;
          return map;
        }, {} as { [key: number]: ICategory });
        this.filteredCategories = Object.values(this.categoryMap); // Inicialmente, todas las categorías están filtradas
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });
  }

  loadAllArticles(): void {
    this.articleService.getAllArticles().subscribe({
      next: (articles: Article[]) => {
        this.articles = articles.filter(article => article.status !== 'archived');
        this.filteredArticles = this.articles;
        this.articles.forEach(article => {
          this.loadCoauthorsForArticle(article.id);
          this.loadCategoriesForArticle(article.id);
          this.loadAuthorForArticle(article.id);
        });
        this.sortArticles(this.sortControl.value); // Ordenar artículos al cargar
      },
      error: (err) => {
        console.error('Error loading articles', err);
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

  filterArticles(): void {
    let searchText = this.searchControl.value.toLowerCase();
    let selectedCategory = this.categorySearchControl.value.toLowerCase();

    this.filteredArticles = this.articles.filter(article => {
      const matchesSearchText = article.title.toLowerCase().includes(searchText);
      const matchesCategory = !selectedCategory || this.categories[article.id]?.some(category => category.category_name.toLowerCase().includes(selectedCategory));
      return matchesSearchText && matchesCategory;
    });

    this.sortArticles(this.sortControl.value); // Ordenar artículos después de filtrar
  }

  filterCategories(searchText: string): void {
    if (!searchText) {
      this.filteredCategories = Object.values(this.categoryMap);
    } else {
      this.filteredCategories = Object.values(this.categoryMap).filter(category =>
        category.category_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  sortArticles(sortOption: string): void {
    if (sortOption === 'recent') {
      this.filteredArticles.sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());
    } else if (sortOption === 'oldest') {
      this.filteredArticles.sort((a, b) => new Date(a.publication_date).getTime() - new Date(b.publication_date).getTime());
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

  viewArticle(articleId: string): void {
    this.router.navigate(['/articulo', articleId]);
  }

  onCategorySearchFocus(): void {
    this.isCategorySearchFocused = true;
  }

  onCategorySearchBlur(): void {
    setTimeout(() => {
      this.isCategorySearchFocused = false;
    }, 200); // Retraso para permitir el clic en la lista
  }
}
