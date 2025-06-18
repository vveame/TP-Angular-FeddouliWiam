import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";
import { OrderService } from '../services/order-service';
import { Order } from '../models/Order';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
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
  phone = 0;
  iban = '';
  bankName = '';
  orders: Order[] = [];

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.user = user;
      console.log('ProfileComponent user:', user);

      if (!user) {
        this.orders = [];
        return;
      }

      // Sync form fields
      this.fullName = user.getFullName();
      this.email = user.getEmail();
      this.phone = user.getPhone();
      this.iban = user.getIban();
      this.bankName = user.getBankName();

      // Fetch orders only if user is valid
      this.orderService.getOrdersByUserId(user.getUserId()).subscribe(data => {
        this.orders = data;
      });

    });
  }

  savePersonalInfo(): void {
    if (!this.user) return;
    this.user.setFullName(this.fullName.trim());
    this.user.setEmail(this.email.trim());
    this.user.setPhone(this.phone);

    this.userService.updateUser(this.user).subscribe({
      next: updated => {
        this.user = updated;
        this.editPersonal = false;
      },
      error: err => console.error('Erreur mise à jour infos perso', err)
    });
  }

  saveBankInfo(): void {
    if (!this.user) return;
    this.user.setIban(this.iban.trim());
    this.user.setBankName(this.bankName.trim());

    this.userService.updateUser(this.user).subscribe({
      next: updated => {
        this.user = updated;
        this.editBank = false;
      },
      error: err => console.error('Erreur mise à jour infos bancaires', err)
    });
  }

  goToUserManagement() {
    this.router.navigate(['/user-management']);
  }
}
