import { Component, OnDestroy } from '@angular/core';
import { CartService } from '../services/cart-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { UserService } from '../services/user-service';
import { User } from '../models/User';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SearchBarComponent, ShoppingCartComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  cartItemCount = 0;
  showCart = false;
  user: User | null = null;

  private cartSubscription?: Subscription;
  private visibilitySubscription?: Subscription;

  constructor(private cartService: CartService, private router: Router, private route: ActivatedRoute, private userService: UserService) {
    this.cartSubscription = this.cartService.cart.subscribe(cart => {
      this.cartItemCount = cart.totalItems;
    });

    this.visibilitySubscription = this.cartService.cartVisible.subscribe(visible => {
      this.showCart = visible;
    });

    this.userService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onSearch(query: string) {
    this.router.navigate(['/catalog'], { queryParams: { search: query } });
  }

  toggleCart() {
    this.cartService.toggleCart();
  }

  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
    this.visibilitySubscription?.unsubscribe();
  }

  signOut() {
    if (this.user) {
      this.userService.signOut();
      this.cartService.clearStorage();

      const currentUrl = this.router.url;

      if (currentUrl.startsWith('/catalog')) {
        // If already on /catalog, reload the page
        window.location.reload();
      } else {
        // Navigate to /catalog
        this.router.navigate(['/catalog']);
      }
    }
  }

}
