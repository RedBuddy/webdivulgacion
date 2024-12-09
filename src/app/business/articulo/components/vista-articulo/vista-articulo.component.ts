import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
//Servicios
import { ArticleService } from '../../../../core/services/article.service';
import { ArticleCategoryService } from '../../../../core/services/article-category.service';
import { ArticleCoauthorService } from '../../../../core/services/article-coauthor.service';
import { CategoryService } from '../../../../core/services/category.service';
//Modelos
import { Article } from '../../../../core/models/article.model';
import { ICategory } from '../../../../core/models/category.model';
import { ICoauthor } from '../../../../core/models/coauthor.model';



@Component({
  selector: 'app-vista-articulo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vista-articulo.component.html',
  styleUrl: './vista-articulo.component.scss'
})


export class VistaArticuloComponent implements OnInit {

  articleId: string | null = null;
  article: Article | null = null;
  categories: ICategory[] = [];
  coauthors: ICoauthor[] = [];
  categoryMap: { [key: number]: ICategory } = {}; // Mapa de categorías por ID
  errorMessage: string | null = null;

  activeTab: 'contenido' | 'coautores' = 'contenido'; // Tab activa

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private articleCategoryService: ArticleCategoryService,
    private articleCoauthorService: ArticleCoauthorService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');
    if (this.articleId) {
      this.loadAllCategories();
      this.loadArticle(this.articleId);
    }
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

  loadArticle(articleId: string): void {
    const ArtId = parseInt(articleId, 10);
    this.articleService.getArticleById(ArtId).subscribe({
      next: (article: Article) => {
        this.article = article;
        this.loadCategoriesForArticle(article.id);
        this.loadCoauthorsForArticle(article.id);
      },
      error: (err) => {
        console.error('Error loading article', err);
        this.errorMessage = 'Error al cargar el artículo.';
      }
    });
  }

  loadCategoriesForArticle(articleId: number): void {
    this.articleCategoryService.getArticleCategories(articleId).subscribe({
      next: (response: { id_article: number, id_categories: number[] }) => {
        this.categories = response.id_categories.map(id => this.categoryMap[id]);
      },
      error: (err) => {
        console.error('Error loading categories for article', err);
      }
    });
  }

  loadCoauthorsForArticle(articleId: number): void {
    this.articleCoauthorService.getArticleCoauthors(articleId).subscribe({
      next: (coauthors: ICoauthor[]) => {
        this.coauthors = coauthors;
      },
      error: (err) => {
        console.error('Error loading coauthors for article', err);
      }
    });
  }

  setActiveTab(tab: 'contenido' | 'coautores'): void {
    this.activeTab = tab;
  }

  viewProfile(userId: string): void {
    this.router.navigate(['/perfil', userId]);
  }

}
