import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { User_filter } from '../../../../core/models/user_filter.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacto-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto-list.component.html',
  styleUrl: './contacto-list.component.scss'
})

export class ContactoListComponent implements OnInit {
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
    this.profileService.getAdminList().subscribe({
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

  contactUser(email: string | undefined): void {
    if (email) {
      this.router.navigate(['contacto/mensaje', { email: email }]);
    }
  }
}
