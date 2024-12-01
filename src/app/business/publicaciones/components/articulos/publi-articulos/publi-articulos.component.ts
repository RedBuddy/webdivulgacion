import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../../../core/services/article.service';
import { ArticleCoauthorService } from '../../../../../core/services/article-coauthor.service';
import { Article } from '../../../../../core/models/article.model';
import { ICoauthor } from '../../../../../core/models/coauthor.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publi-articulos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publi-articulos.component.html',
  styleUrls: ['./publi-articulos.component.scss']
})
export class PubliArticulosComponent implements OnInit {
  articles: Article[] = [];
  coauthors: { [key: number]: ICoauthor[] } = {}; // Mapa de coautores por artículo

  constructor(
    private articleService: ArticleService,
    private articleCoauthorService: ArticleCoauthorService
  ) { }

  ngOnInit(): void {
    this.loadUserArticles();
  }

  loadUserArticles(): void {
    this.articleService.getUserArticles().subscribe((articles) => {
      this.articles = articles;
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

  editArticle(article: Article): void {
    // Implementar la lógica de edición aquí
  }
}
