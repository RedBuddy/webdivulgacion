import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
//Servicios
import { ArticleService } from '../../../../core/services/article.service';
import { ArticleCategoryService } from '../../../../core/services/article-category.service';
import { ArticleCoauthorService } from '../../../../core/services/article-coauthor.service';
import { CategoryService } from '../../../../core/services/category.service';
//Modelos
import { Article } from '../../../../core/models/article.model';
import { ICategory } from '../../../../core/models/category.model';
import { ICoauthor } from '../../../../core/models/coauthor.model';
import { Author } from '../../../../core/models/author.model';



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
  author: Author | null = null;
  categoryMap: { [key: number]: ICategory } = {}; // Mapa de categorías por ID
  errorMessage: string | null = null;

  safePdfUrl: SafeResourceUrl = '';

  activeTab: 'contenido' | 'coautores' | 'pdf' = 'contenido'; // Tab activa

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private articleCategoryService: ArticleCategoryService,
    private articleCoauthorService: ArticleCoauthorService,
    private categoryService: CategoryService,
    private router: Router,
    private sanitizer: DomSanitizer
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
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(article.pdf_url || '');
        this.loadCategoriesForArticle(article.id);
        this.loadCoauthorsForArticle(article.id);
        this.loadAuthorForArticle(article.id);
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

  loadAuthorForArticle(articleId: number): void {
    this.articleService.getAuthorByArticleId(articleId).subscribe({
      next: (author: Author) => {
        this.author = author;
      },
      error: (err) => {
        console.error('Error loading author for article', err);
      }
    });
  }

  setActiveTab(tab: 'contenido' | 'coautores' | 'pdf'): void {
    this.activeTab = tab;
  }

  viewProfile(userId: string): void {
    this.router.navigate(['/perfil', userId]);
  }

  openPdf(): void {
    if (this.article?.pdf_url) {
      window.open(this.article.pdf_url, '_blank');
    }
  }

}
