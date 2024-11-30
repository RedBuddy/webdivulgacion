import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../../../core/services/article.service';
import { Article } from '../../../../../core/models/article.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publi-articulos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publi-articulos.component.html',
  styleUrl: './publi-articulos.component.scss'
})
export class PubliArticulosComponent {
  articles: Article[] = [];

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.loadUserArticles();
  }

  loadUserArticles(): void {
    this.articleService.getUserArticles().subscribe((articles) => {
      this.articles = articles;
    });
  }

  editArticle(article: Article): void {
    // Implementar la lógica de edición aquí
  }
}
