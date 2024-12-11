import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ResourceService } from '../../../../../core/services/resource.service';
import { Resource } from '../../../../../core/models/resource.model';
import { Author } from '../../../../../core/models/author.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recursos-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recursos-list.component.html',
  styleUrl: './recursos-list.component.scss'
})

export class RecursosListComponent implements OnInit {
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  authors: { [key: number]: Author } = {}; // Mapa de autores por recurso
  errorMessage: string | null = null;
  resourceToDelete: Resource | null = null; // Recurso a eliminar
  categoryControl: FormControl = new FormControl(''); // Control para el select de clasificación
  searchControl: FormControl = new FormControl(''); // Control para el cuadro de búsqueda
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math = Math;

  constructor(private resourceService: ResourceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.loadResources();

    this.categoryControl.valueChanges.subscribe(value => {
      this.filterResources();
    });

    this.searchControl.valueChanges.subscribe(value => {
      this.filterResources();
    });
  }

  loadResources(): void {
    this.resourceService.getAllResources().subscribe({
      next: (resources: Resource[]) => {
        this.resources = resources;
        this.filteredResources = this.resources;
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

  filterResources(): void {
    const category = this.categoryControl.value;
    const searchText = this.searchControl.value.toLowerCase();

    this.filteredResources = this.resources.filter(resource => {
      const matchesCategory = !category || resource.resource_category === category;
      const matchesSearchText = !searchText || resource.title.toLowerCase().includes(searchText) || resource.description.toLowerCase().includes(searchText);
      return matchesCategory && matchesSearchText;
    });
  }

  openPdf(resource: Resource): void {
    if (resource.pdf_url) {
      window.open(resource.pdf_url, '_blank');
    }
  }

  confirmDelete(resource: Resource): void {
    this.resourceToDelete = resource;
  }

  deleteResource(): void {
    if (this.resourceToDelete) {
      this.resourceService.deleteResource(this.resourceToDelete.id).subscribe({
        next: () => {
          this.resources = this.resources.filter(resource => resource.id !== this.resourceToDelete!.id);
          this.filteredResources = this.filteredResources.filter(resource => resource.id !== this.resourceToDelete!.id);
          this.resourceToDelete = null;
        },
        error: (err) => {
          console.error('Error deleting resource', err);
          this.errorMessage = 'Error al eliminar el recurso.';
          this.resourceToDelete = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.resourceToDelete = null;
  }

  get paginatedResources(): Resource[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredResources.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  navigateToPublish(): void {
    this.router.navigate(['admin/recurso-subir']);
  }

  editResource(resourceId: number): void {
    this.router.navigate(['admin/recurso-editar', resourceId]);
  }
}
