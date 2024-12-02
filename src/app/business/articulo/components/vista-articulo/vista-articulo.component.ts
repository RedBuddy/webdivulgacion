import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-vista-articulo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vista-articulo.component.html',
  styleUrl: './vista-articulo.component.scss'
})
export class VistaArticuloComponent implements OnInit {

  articleId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');
  }

}
