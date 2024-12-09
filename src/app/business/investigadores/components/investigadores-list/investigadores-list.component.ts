import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { User_filter } from '../../../../core/models/user_filter.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-investigadores-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investigadores-list.component.html',
  styleUrls: ['./investigadores-list.component.scss']
})
export default class InvestigadoresListComponent implements OnInit {
  filteredUsers: User_filter[] = [];
  paginatedUsers: User_filter[] = [];
  errorMessage: string | null = null;
  Math = Math;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadInvestigadores();
  }

  loadInvestigadores(): void {
    this.profileService.getAuthorList().subscribe({
      next: (users: User_filter[]) => {
        this.filteredUsers = users;
        this.paginateUsers();
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error loading investigadores', err);
        this.errorMessage = 'Error al cargar la lista de investigadores';
        this.clearResults();
      }
    });
  }

  clearResults(): void {
    this.filteredUsers = [];
    this.paginatedUsers = [];
  }

  paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.paginateUsers();
  }

  viewProfile(userId: string): void {
    this.router.navigate(['/perfil', userId]);
  }
}
