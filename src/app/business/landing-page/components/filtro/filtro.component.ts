
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FitroService } from '../../services/fitro.service';
import { User_filter } from '../../../../core/models/user_filter.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.scss'
})

export class FiltroComponent implements OnInit {
  searchText: string | null = null;
  filteredUsers: User_filter[] = [];
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private fitroService: FitroService) { }

  ngOnInit(): void {
    this.searchText = this.route.snapshot.params['texto'];
    console.log('Texto de búsqueda:', this.searchText);
    if (this.searchText) {
      // this.searchControl.setValue(this.searchText, { emitEvent: false });
      this.filterUsers(this.searchText);
    }
  }

  filterUsers(searchString: string): void {
    this.fitroService.filterUsers(searchString).subscribe({
      next: (users: User_filter[]) => {
        this.filteredUsers = users;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error filtering users', err);
        this.errorMessage = 'Error al filtrar los usuarios';
      }
    });
  }
}

