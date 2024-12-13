import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../../../core/models/user.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})

export class UsuariosListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  editForm: FormGroup;
  searchControl: FormControl = new FormControl(''); // Control para el cuadro de búsqueda
  editingUserId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  Math = Math;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role_id: ['', Validators.required],
      verified: [false, Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    this.searchControl.valueChanges.subscribe(value => {
      this.filterUsers(value);
    });
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.filteredUsers = users;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.errorMessage = 'Error al cargar la lista de usuarios.';
      }
    });
  }

  filterUsers(searchText: string): void {
    if (!searchText) {
      this.filteredUsers = this.users;
    } else {
      const lowerSearchText = searchText.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(lowerSearchText) ||
        user.first_name.toLowerCase().includes(lowerSearchText) ||
        user.last_name.toLowerCase().includes(lowerSearchText) ||
        user.email.toLowerCase().includes(lowerSearchText)
      );
    }
  }

  startEditing(user: User): void {
    this.editingUserId = user.id;
    this.editForm.patchValue({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role_id: user.role_id,
      verified: user.verified,
      status: user.status
    });
  }

  cancelEditing(): void {
    this.editingUserId = null;
    this.editForm.reset();
  }

  saveUser(): void {
    if (this.editForm.valid && this.editingUserId !== null) {
      const updatedUser = {
        ...this.editForm.value,
        verified: this.editForm.value.verified === 'true' ? true : this.editForm.value.verified === 'false' ? false : this.editForm.value.verified
      };

      this.adminService.updateUserById(this.editingUserId, updatedUser).subscribe({
        next: (user: User) => {
          const index = this.users.findIndex(u => u.id === this.editingUserId);
          if (index !== -1) {
            // Actualizar el usuario en la lista con los valores del formulario
            this.users[index] = { ...this.users[index], ...updatedUser };
            this.filteredUsers = this.users; // Actualizar la lista filtrada
          }
          this.successMessage = 'Usuario actualizado exitosamente';
          this.errorMessage = null;
          this.editingUserId = null;
          this.editForm.reset();
          this.loadUsers();
          setTimeout(() => {
            this.successMessage = null;
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err.message;
          setTimeout(() => {
            this.errorMessage = null;
          }, 2000);
        }
      });
    }
  }

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1:
        return 'Lector';
      case 2:
        return 'Autor';
      case 3:
        return 'Editor';
      case 4:
        return 'Admin';
      default:
        return 'Desconocido';
    }
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
