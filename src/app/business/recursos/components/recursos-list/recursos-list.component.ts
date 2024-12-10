import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResourceService } from '../../../../core/services/resource.service';
import { Resource } from '../../../../core/models/resource.model';
import { Author } from '../../../../core/models/author.model';

@Component({
  selector: 'app-recursos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recursos-list.component.html',
  styleUrl: './recursos-list.component.scss'
})

export class RecursosListComponent implements OnInit {
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  authors: { [key: number]: Author } = {}; // Mapa de autores por recurso
  errorMessage: string | null = null;
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math = Math;

  constructor(private resourceService: ResourceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const category = params['category'];
      this.loadResources(category);
    });
  }

  loadResources(category: string): void {
    this.resourceService.getAllResources().subscribe({
      next: (resources: Resource[]) => {
        this.resources = resources;
        this.filteredResources = this.resources.filter(resource => resource.resource_category === category);
        this.filteredResources.forEach(resource => {
          this.loadAuthorForResource(resource.id);
        });
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error loading resources', err);
        this.errorMessage = 'Error al cargar la lista de recursos.';
      }
    });
  }

  loadAuthorForResource(resourceId: number): void {
    this.resourceService.getAuthorByResourceId(resourceId).subscribe({
      next: (author: Author) => {
        this.authors[resourceId] = author;
      },
      error: (err) => {
        console.error('Error loading author for resource', err);
      }
    });
  }

  openPdf(resource: Resource): void {
    if (resource.pdf_url) {
      window.open(resource.pdf_url, '_blank');
    }
  }

  get paginatedResources(): Resource[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredResources.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
