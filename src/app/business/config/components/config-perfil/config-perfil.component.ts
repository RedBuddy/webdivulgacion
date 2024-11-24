import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../../../core/models/profile.model';
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
  errorMessage: string | null = null; // Propiedad para el mensaje de error
  successMessage: string | null = null; // Propiedad para el mensaje de éxito
  initialProfile: Profile | null = null; // Propiedad para almacenar el perfil inicial

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      biography: ['', Validators.required],
      experience: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile: Profile) => {
        this.initialProfile = profile; // Almacenar el perfil inicial
        this.profileForm.patchValue(profile);
      },
      error: (err) => {
        console.error('Error loading profile data', err);
        this.errorMessage = 'Error al cargar los datos del perfil.';
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
      this.errorMessage = 'No hay cambios para guardar';
      return;
    }

    this.profileService.updateProfile(profile).subscribe({
      next: (response) => {
        console.log('Profile updated successfully', response);
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

  private isProfileUnchanged(profile: Profile): boolean {
    return this.initialProfile?.biography === profile.biography &&
      this.initialProfile?.experience === profile.experience;
  }
}
