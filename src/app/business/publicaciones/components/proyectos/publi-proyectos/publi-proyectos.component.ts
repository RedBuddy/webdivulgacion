import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchProjectsService } from '../../../../../core/services/research-projects.service';
import { ProjectCategoryService } from '../../../../../core/services/project-category.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { ResearchProject } from '../../../../../core/models/research-project.model';
import { ICategory } from '../../../../../core/models/category.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-publi-proyectos',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './publi-proyectos.component.html',
  styleUrls: ['./publi-proyectos.component.scss']
})
export class PubliProyectosComponent implements OnInit {
  projects: ResearchProject[] = [];
  filteredProjects: ResearchProject[] = [];
  categories: { [key: number]: ICategory[] } = {}; // Mapa de categorías por proyecto
  categoryMap: { [key: number]: ICategory } = {}; // Mapa de categorías por ID
  searchControl: FormControl = new FormControl('');
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math = Math;

  constructor(
    private researchProjectsService: ResearchProjectsService,
    private projectCategoryService: ProjectCategoryService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadAllCategories();
    this.loadUserProjects();
    this.route.queryParams.subscribe(params => {
      const search = params['search'] || '';
      this.searchControl.setValue(search, { emitEvent: false });
      this.filterProjects(search);
      this.currentPage = 1;
    });

    this.searchControl.valueChanges.subscribe(value => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: value },
        queryParamsHandling: 'merge'
      });
      this.filterProjects(value);
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

  loadUserProjects(): void {
    this.researchProjectsService.getUserProjects().subscribe({
      next: (projects: ResearchProject[]) => {
        if (projects === null) {
          this.errorMessage = 'No tienes proyectos publicados.';
        } else {
          this.projects = projects;
          this.filteredProjects = projects;
          this.projects.forEach(project => {
            this.loadCategoriesForProject(project.id);
          });
        }
      },
      error: (err) => {
        console.error('Error loading user projects', err);
        this.errorMessage = 'Error al cargar los proyectos del usuario.';
      }
    });
  }

  loadCategoriesForProject(projectId: number): void {
    this.projectCategoryService.getProjectCategories(projectId).subscribe({
      next: (response: { id_project: number, id_categories: number[] }) => {
        this.categories[projectId] = response.id_categories.map(id => this.categoryMap[id]);
      },
      error: (err) => {
        console.error('Error loading categories for project', err);
      }
    });
  }

  filterProjects(searchText: string): void {
    if (!searchText) {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(project =>
        project.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  get paginatedProjects(): ResearchProject[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProjects.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  editProject(project: ResearchProject): void {
    this.router.navigate(['mis-publicaciones/editar-proyecto', project.id]);
  }
}
