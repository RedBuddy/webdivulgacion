import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchProjectsService } from '../../../../core/services/research-projects.service';
import { ProjectCategoryService } from '../../../../core/services/project-category.service';
import { CategoryService } from '../../../../core/services/category.service';
import { ResearchProject } from '../../../../core/models/research-project.model';
import { ICategory } from '../../../../core/models/category.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile.service';
import { UserCard } from '../../../../core/models/profile_card.model';

@Component({
  selector: 'app-perfil-proyectos',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './perfil-proyectos.component.html',
  styleUrl: './perfil-proyectos.component.scss'
})
export class PerfilProyectosComponent implements OnInit {
  profileId: string | null = null;
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

  email: string | null = null;

  constructor(
    private researchProjectsService: ResearchProjectsService,
    private projectCategoryService: ProjectCategoryService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.profileId = params.get('id');
      this.loadAllCategories();
      this.loadUserProjects();
      if (this.profileId) {
        this.loadUserCard(this.profileId);
      }
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
    const userId = parseInt(this.profileId!, 10);
    if (this.profileId === null) {
      this.errorMessage = 'No se pudo obtener el ID del usuario.';
      return;
    }
    this.researchProjectsService.getUserProjects(userId).subscribe({
      next: (projects: ResearchProject[]) => {
        if (projects.length === 0) {
          this.errorMessage = 'No hay proyectos publicados por el usuario.';
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

  loadUserCard(userId: string): void {
    this.profileService.getUserCard(userId).subscribe({
      next: (userCard: UserCard) => {
        this.email = userCard.email;
      },
      error: (err) => {
        console.error('Error loading user card', err);
        this.errorMessage = 'Error al cargar la tarjeta de usuario.';
      }
    });
  }


  contactUser(): void {
    if (this.email) {
      this.router.navigate(['contacto/mensaje', { email: this.email }]);
    }
  }
}
