import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../../core/services/article.service';
import { ArticleCoauthorService } from '../../../../core/services/article-coauthor.service';
import { ArticleCategoryService } from '../../../../core/services/article-category.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Article } from '../../../../core/models/article.model';
import { ICoauthor } from '../../../../core/models/coauthor.model';
import { ICategory } from '../../../../core/models/category.model';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-perfil-articulos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-articulos.component.html',
  styleUrl: './perfil-articulos.component.scss'
})
export class PerfilArticulosComponent implements OnInit {
  profileId: string | null = null;

  articles: Article[] = [];
  filteredArticles: Article[] = [];
  coauthors: { [key: number]: ICoauthor[] } = {}; // Mapa de coautores por artículo
  categories: { [key: number]: ICategory[] } = {}; // Mapa de categorías por artículo
  categoryMap: { [key: number]: ICategory } = {}; // Mapa de categorías por ID
  errorMessage: string | null = null;

  searchControl: FormControl = new FormControl('');
  //Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math = Math;


  constructor(
    private articleService: ArticleService,
    private articleCoauthorService: ArticleCoauthorService,
    private articleCategoryService: ArticleCategoryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.profileId = params.get('id');
      this.loadAllCategories();
      this.loadUserArticles();
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

  loadUserArticles(): void {
    const userId = parseInt(this.profileId!, 10);
    if (this.profileId === null) {
      this.errorMessage = 'No se pudo obtener el ID del usuario.';
      return;
    }
    this.articleService.getUserArticles(userId).subscribe({
      next: (articles: Article[]) => {
        if (articles.length === 0) {
          this.errorMessage = 'No hay articulos publicados por el usuario.';
        } else {
          this.articles = articles.filter(article => article.status !== 'archived');
          this.filteredArticles = articles;
          this.articles.forEach(article => {
            this.loadCoauthorsForArticle(article.id);
            this.loadCategoriesForArticle(article.id);
          });
        }
      },
      error: (err) => {
        console.error('Error loading user articles', err);
        this.errorMessage = 'Error al cargar los artículos del usuario.';
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

  viewArticle(articleId: string): void {
    this.router.navigate(['/articulo', articleId]);
  }
}
