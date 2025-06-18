import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CartService } from '../services/cart-service';
import { ShoppingCart } from '../models/ShoppingCart';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StockService } from '../services/stock-service';

@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart!: ShoppingCart;

  constructor(private cartService: CartService,
    private router: Router,
    public stockService: StockService
  ) { }

  ngOnInit(): void {
    this.cartService.cart.subscribe(cart => this.cart = cart);
  }

  increaseQuantity(productId: string) {
    const item = this.cart.itemsProduct.find(i => i.itemProduct.getProductId() === productId);
    if (!item) return;

    const available = item.itemProduct.getProductQuantity();
    if (item.quantity < available) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    } else {
      alert('Quantité maximale disponible atteinte');
    }
  }

  decreaseQuantity(productId: string) {
    const item = this.cart.itemsProduct.find(i => i.itemProduct.getProductId() === productId);
    if (item) this.cartService.updateQuantity(productId, item.quantity - 1);
  }

  remove(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  checkout() {
    this.router.navigate(['/order-page']);
  }
}
