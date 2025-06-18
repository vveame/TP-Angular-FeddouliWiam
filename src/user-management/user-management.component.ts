import { Component, OnInit } from '@angular/core';
import { User, NewUserForm, UserType } from '../models/User';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  selectedUserCopy: any = null;

  newUser: NewUserForm = {
    fullName: '',
    email: '',
    password: '',
    phone: 0,
    iban: '',
    bankName: '',
    userType: UserType.Member
  };

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: users => this.users = users,
      error: () => alert("Erreur de chargement des utilisateurs")
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.selectedUserCopy = {
      fullName: user.getFullName(),
      email: user.getEmail(),
      phone: user.getPhone(),
      iban: user.getIban(),
      bankName: user.getBankName(),
      userType: user.getUserType(),
    };
  }

  updateUser(): void {
    if (!this.selectedUser || !this.selectedUserCopy) return;

    this.selectedUser.setFullName(this.selectedUserCopy.fullName);
    this.selectedUser.setEmail(this.selectedUserCopy.email);
    this.selectedUser.setPhone(this.selectedUserCopy.phone);
    this.selectedUser.setIban(this.selectedUserCopy.iban);
    this.selectedUser.setBankName(this.selectedUserCopy.bankName);
    this.selectedUser.setUserType(this.selectedUserCopy.userType);

    this.userService.updateUser(this.selectedUser).subscribe({
      next: () => {
        alert('Utilisateur mis à jour');
        this.selectedUser = null;
        this.selectedUserCopy = null;
        this.fetchUsers();
      },
      error: () => alert("Erreur de mise à jour")
    });
  }

  deleteUser(id: string): void {
    if (!confirm("Confirmer la suppression ?")) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        alert("Utilisateur supprimé");
        this.fetchUsers();
      },
      error: () => alert("Erreur de suppression")
    });
  }

  addUser(): void {
    if (!this.newUser.fullName || !this.newUser.email || !this.newUser.password) {
      alert("Nom, email et mot de passe requis");
      return;
    }

    this.userService.addUser(this.newUser).subscribe({
      next: () => {
        alert("Utilisateur ajouté");
        this.newUser = {
          fullName: '',
          email: '',
          password: '',
          phone: 0,
          iban: '',
          bankName: '',
          userType: UserType.Member
        };
        this.fetchUsers();
      },
      error: () => alert("Erreur d'ajout")
    });
  }

  cancelEdit(): void {
    this.selectedUser = null;
  }

  goBack(): void {
    this.router.navigate(['/profil']);
  }
}
