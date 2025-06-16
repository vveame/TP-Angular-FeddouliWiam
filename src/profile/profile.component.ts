import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  selectedTab: 'personal' | 'bank' | 'orders' = 'personal';

  editPersonal = false;
  editBank = false;

  // Temporary fields for form binding
  fullName = '';
  email = '';
  iban = '';
  bankName = '';

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.user = user;
      console.log('ProfileComponent user:', user);

      // Sync form fields
      if (this.user) {
        this.fullName = this.user.getFullName();
        this.email = this.user.getEmail();
        this.iban = this.user.getIban();
        this.bankName = this.user.getBankName();
      }
    });
  }

  savePersonalInfo(): void {
    if (!this.user) return;
    this.user.setFullName(this.fullName.trim());
    this.user.setEmail(this.email.trim());
    this.editPersonal = false;

    // Optional: Save to backend
    // this.userService.updateUser(this.user).subscribe(...);
  }

  saveBankInfo(): void {
    if (!this.user) return;
    this.user.setIban(this.iban.trim());
    this.user.setBankName(this.bankName.trim());
    this.editBank = false;

    // Optional: Save to backend
    // this.userService.updateUser(this.user).subscribe(...);
  }
}
