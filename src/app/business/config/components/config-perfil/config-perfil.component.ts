import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../../core/services/profile.service';
import { Profile } from '../../../../core/models/profile.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './config-perfil.component.html',
  styleUrls: ['./config-perfil.component.scss']
})

export class ConfigPerfilComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      biography: ['', Validators.required],
      experience: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
      },
      error: (err) => {
        console.error('Error loading profile', err);
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        console.log('Profile updated successfully');
      },
      error: (err) => {
        console.error('Error updating profile', err);
      }
    });
  }
}
