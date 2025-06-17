import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";
import { OrderService } from '../services/order-service';
import { Order } from '../models/Order';

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
  orders: Order[] = [];

  constructor(
    private userService: UserService,
    private orderService: OrderService
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
      this.iban = user.getIban();
      this.bankName = user.getBankName();

      // Fetch orders only if user is valid
      this.orderService.getOrdersByUserId(user.getUserId()).subscribe(data => {
        this.orders = data.map(o => new Order(
          o.userId,
          o.items,
          o.paymentMethod,
          o.deliveryAddress,
          o.shippingFee,
          o.totalPrice
        ));
      });
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
