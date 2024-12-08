import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile.service';
import { UserAbout } from '../../../../core/models/user_about.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-info.component.html',
  styleUrl: './perfil-info.component.scss'
})

export class PerfilInfoComponent implements OnInit {
  profileId: string | null = null;
  userAbout: UserAbout | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.profileId = params.get('id');
      if (this.profileId) {
        this.loadUserAbout(this.profileId);
      }
    });
  }

  loadUserAbout(userId: string): void {
    this.profileService.getUserAbout(userId).subscribe({
      next: (userAbout: UserAbout) => {
        this.userAbout = userAbout;
      },
      error: (err) => {
        console.error('Error loading user about', err);
        this.errorMessage = 'Error al cargar la información del usuario.';
      }
    });
  }
}
