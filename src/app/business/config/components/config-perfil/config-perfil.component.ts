import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { CategoryService } from '../../../../core/services/category.service';
import { UserDisciplineService } from '../../services/user-discipline.service';
import { Profile } from '../../../../core/models/profile.model';
import { ICategory } from '../../../../core/models/category.model';
import { IUserDiscipline } from '../../../../core/models/user_discipline.model';


@Component({
  selector: 'app-config-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './config-perfil.component.html',
  styleUrls: ['./config-perfil.component.scss']
})
export class ConfigPerfilComponent implements OnInit {
  profileForm: FormGroup;
  categories: ICategory[] = [];
  filteredCategories: ICategory[] = [];
  searchControl: FormControl = new FormControl(''); // FormControl para el texto de búsqueda
  addedCategories: ICategory[] = [];
  userDisciplines: number[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  initialProfile: Profile | null = null;
  isSearchFocused: boolean = false; // Variable para rastrear el enfoque del cuadro de búsqueda

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private categoryService: CategoryService,
    private userDisciplineService: UserDisciplineService
  ) {
    this.profileForm = this.fb.group({
      biography: ['', Validators.required],
      experience: ['', Validators.required],
      disciplines: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadCategories();

    // Filtrar categorías cuando cambia el texto de búsqueda
    this.searchControl.valueChanges.subscribe(value => {
      this.filterCategories(value);
    });
  }

  loadUserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile: Profile) => {
        this.initialProfile = profile;
        this.profileForm.patchValue(profile);
        this.loadUserDisciplines(profile.id_user);
      },
      error: (err) => {
        console.error('Error loading profile data', err);
        this.errorMessage = 'Error al cargar los datos del perfil.';
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: ICategory[]) => {
        this.categories = categories;
        this.filteredCategories = categories; // Inicialmente, todas las categorías están filtradas
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.errorMessage = 'Error al cargar las categorías.';
      }
    });
  }

  loadUserDisciplines(userId: number): void {
    this.userDisciplineService.getUserDisciplines(userId).subscribe({
      next: (disciplines: IUserDiscipline[]) => {
        this.userDisciplines = disciplines.map(d => d.id_category);
        this.profileForm.patchValue({ disciplines: this.userDisciplines });
      },
      error: (err) => {
        console.error('Error loading user disciplines', err);
        this.errorMessage = 'Error al cargar las disciplinas del usuario.';
      }
    });
  }

  addCategory(category: ICategory): void {
    if (category && !this.addedCategories.includes(category)) {
      this.addedCategories.push(category);
      this.profileForm.patchValue({ disciplines: this.addedCategories.map(c => c.id) });
      this.searchControl.setValue(''); // Limpiar el campo de búsqueda después de agregar
      this.filteredCategories = this.categories; // Resetear la lista filtrada
      this.isSearchFocused = false; // Ocultar la lista después de agregar
    }
  }

  filterCategories(searchText: string): void {
    if (!searchText) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.category_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  onSearchFocus(): void {
    this.isSearchFocused = true;
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.isSearchFocused = false;
    }, 200); // Retraso para permitir el clic en la lista
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const profile: Profile = this.profileForm.value;

    if (this.initialProfile && this.isProfileUnchanged(profile)) {
      this.errorMessage = 'No hay cambios para guardar.';
      return;
    }

    this.profileService.updateProfile(profile).subscribe({
      next: (response) => {
        console.log('Profile updated successfully', response);
        this.updateUserDisciplines(profile.id_user, this.profileForm.get('disciplines')?.value);
        this.successMessage = 'Perfil actualizado exitosamente';
        this.errorMessage = null; // Limpiar mensaje de error
      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.errorMessage = err; // Capturar el mensaje de error del backend
        this.successMessage = null; // Limpiar mensaje de éxito
      }
    });
  }

  updateUserDisciplines(userId: number, disciplines: number[]): void {
    this.userDisciplineService.updateUserDisciplines(userId, disciplines).subscribe({
      next: (response) => {
        console.log('User disciplines updated successfully', response);
      },
      error: (err) => {
        console.error('Error updating user disciplines', err);
        this.errorMessage = 'Error al actualizar las disciplinas del usuario.';
      }
    });
  }

  private isProfileUnchanged(profile: Profile): boolean {
    return this.initialProfile?.biography === profile.biography &&
      this.initialProfile?.experience === profile.experience &&
      JSON.stringify(this.userDisciplines) === JSON.stringify(this.profileForm.get('disciplines')?.value);
  }
}
