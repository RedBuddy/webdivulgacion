import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service'; // Asegúrate de que la ruta sea correcta
import { CategoryService } from '../../../../core/services/category.service'; // Asegúrate de que la ruta sea correcta
import { UserDisciplineService } from '../../services/user-discipline.service'; // Asegúrate de que la ruta sea correcta
import { Profile } from '../../../../core/models/profile.model';// Asegúrate de que la ruta sea correcta
import { ICategory } from '../../../../core/models/category.model'; // Asegúrate de que la ruta sea correcta
import { IUserDiscipline } from '../../../../core/models/user_discipline.model'; // Asegúrate de que la ruta sea correcta
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


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
  userDisciplines: number[] = [];
  errorMessage: string | null = null; // Propiedad para el mensaje de error
  successMessage: string | null = null; // Propiedad para el mensaje de éxito
  initialProfile: Profile | null = null; // Propiedad para almacenar el perfil inicial

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private categoryService: CategoryService,
    private userDisciplineService: UserDisciplineService
  ) {
    this.profileForm = this.fb.group({
      biography: ['', Validators.required],
      experience: ['', Validators.required],
      disciplines: [[], Validators.required] // Campo para las disciplinas
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadCategories();
  }

  loadUserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile: Profile) => {
        this.initialProfile = profile; // Almacenar el perfil inicial
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

  saveProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const profile: Profile = this.profileForm.value;

    // Verificar si hay cambios en el formulario
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
