import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShoppingCartItem } from '../models/ShoppingCartItem';
import { ShoppingCart } from '../models/ShoppingCart';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: ShoppingCartItem[] = [];
  private cartSubject = new BehaviorSubject<ShoppingCart>(this.getCartData());

  cart = this.cartSubject.asObservable();

  constructor() {
    if (this.isBrowser()) {
      const stored = sessionStorage.getItem('cart');
      if (stored) {
        try {
          this.items = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse cart from sessionStorage', e);
        }
        this.updateCart();
      }
    }
  }

  private getCartData(): ShoppingCart {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.items.reduce((sum, item) => sum + item.quantity * item.itemProduct.getProductPrice(), 0);
    return { itemsProduct: this.items, totalItems, totalPrice };
  }

  private updateCart() {
    this.cartSubject.next(this.getCartData());
    if (this.isBrowser()) {
      sessionStorage.setItem('cart', JSON.stringify(this.items));
    }
  }

  addToCart(product: Product) {
    const index = this.items.findIndex(item => item.itemProduct.getProductId() === product.getProductId());
    if (index !== -1) {
      this.items[index].quantity++;
    } else {
      this.items.push({ itemProduct: product, quantity: 1 });
    }
    this.updateCart();
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter(item => item.itemProduct.getProductId() !== productId);
    this.updateCart();
  }

  clearCart() {
    this.items = [];
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.items.find(item => item.itemProduct.getProductId() === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
    } else if (item && quantity <= 0) {
      this.removeFromCart(productId);
    }
    this.updateCart();
  }

  getCart(): ShoppingCart {
    return this.getCartData();
  }

  // Safe browser check
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }
}