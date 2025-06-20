import { Component, OnDestroy } from '@angular/core';
import { CartService } from '../services/cart-service';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { UserService } from '../services/user-service';
import { User } from '../models/User';
import { AlertService } from '../services/alert-service';
import { SearchService } from '../services/search-service';

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
  user$!: Observable<User | null>;
  currentRoute: string = '';

  private cartSubscription?: Subscription;
  private visibilitySubscription?: Subscription;

  constructor(
    private alertService: AlertService,
    private cartService: CartService,
    private router: Router,
    private userService: UserService,
    private searchService: SearchService
  ) {
    this.user$ = this.userService.currentUser$;

    this.cartSubscription = this.cartService.cart.subscribe(cart => {
      this.cartItemCount = cart.totalItems;
    });

    this.visibilitySubscription = this.cartService.cartVisible.subscribe(visible => {
      this.showCart = visible;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  onSearch(query: string) {
    this.searchService.updateQuery(query);

    if (this.router.url.startsWith('/catalog')) {
      // Fallback if not on catalog
      this.router.navigate(['/catalog'], { queryParams: { search: query } });
    }
  }

  shouldShowSearch(): boolean {
    return ['/catalog', '/offers', '/stock-monitoring'].some(path =>
      this.currentRoute.startsWith(path)
    );
  }

  toggleCart() {
    this.cartService.toggleCart();
  }

  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
    this.visibilitySubscription?.unsubscribe();
  }

  signOut() {
    this.userService.signOut().subscribe({
      next: () => {
        this.cartService.clearStorage();
        this.router.navigate(['/catalog']);
        this.alertService.success('Successfully logged out.');
      },
      error: () => {
        this.alertService.error('Error during logout.');
      }
    });
  }
}
