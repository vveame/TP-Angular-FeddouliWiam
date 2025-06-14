import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CartService } from '../services/cart-service';
import { ShoppingCart } from '../models/ShoppingCart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart!: ShoppingCart;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe(cart => this.cart = cart);
  }

  increaseQuantity(productId: number) {
    const item = this.cart.itemsProduct.find(i => i.itemProduct.getProductId() === productId);
    if (item) this.cartService.updateQuantity(productId, item.quantity + 1);
  }

  decreaseQuantity(productId: number) {
    const item = this.cart.itemsProduct.find(i => i.itemProduct.getProductId() === productId);
    if (item) this.cartService.updateQuantity(productId, item.quantity - 1);
  }

  remove(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  checkout() {
    alert('Checkout process not implemented yet.');
  }
}
