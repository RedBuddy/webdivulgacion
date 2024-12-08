import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile.service';
import { UserCard } from '../../../../core/models/profile_card.model';



@Component({
  selector: 'app-perfil-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './perfil-header.component.html',
  styleUrl: './perfil-header.component.scss'
})
export class PerfilHeaderComponent implements OnInit {
  profileId: string | null = null;
  userCard: UserCard | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id');
      if (this.profileId) {
        this.loadUserCard(this.profileId);
      }
    });
  }

  loadUserCard(userId: string): void {
    this.profileService.getUserCard(userId).subscribe({
      next: (userCard: UserCard) => {
        this.userCard = userCard;
      },
      error: (err) => {
        console.error('Error loading user card', err);
        this.errorMessage = 'Error al cargar la tarjeta de usuario.';
      }
    });
  }
}
