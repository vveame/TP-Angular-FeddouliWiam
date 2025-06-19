import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShoppingCartItem } from '../models/ShoppingCartItem';
import { ShoppingCart } from '../models/ShoppingCart';
import { Product } from '../models/Product';
import { AlertService } from './alert-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: ShoppingCartItem[] = [];
  private cartSubject = new BehaviorSubject<ShoppingCart>(this.getCartData());
  private cartVisibility = new BehaviorSubject<boolean>(false);

  cart = this.cartSubject.asObservable();
  cartVisible = this.cartVisibility.asObservable();

  constructor(
    private alertService: AlertService
  ) {
    if (this.isBrowser()) {
      const stored = sessionStorage.getItem('cart');
      if (stored) {
        try {
          this.items = JSON.parse(stored).map((item: any) => ({
            itemProduct: Object.assign(new Product(item.itemProduct)),
            quantity: item.quantity,
            price: item.price ?? item.itemProduct.getProductPrice() // récupération prix stocké sinon prix normal
          }));
        } catch (e) {
          console.error('Failed to parse cart from sessionStorage', e);
        }
        this.updateCart();
      }
    }
  }

  private getCartData(): ShoppingCart {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    // Calcul du total avec prix unitaire stocké (avec remise)
    const totalPrice = this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return { itemsProduct: this.items, totalItems, totalPrice };
  }

  private updateCart() {
    this.cartSubject.next(this.getCartData());
    if (this.isBrowser()) {
      sessionStorage.setItem('cart', JSON.stringify(this.items));
    }
  }

  // Le prix remisé est passé en paramètre (sinon prix normal)
  addToCart(product: Product, price?: number) {
    const unitPrice = price ?? product.getProductPrice();

    const index = this.items.findIndex(item => item.itemProduct.getProductId() === product.getProductId());
    if (index !== -1) {
      const existing = this.items[index];
      if (existing.quantity < product.getProductQuantity()) {
        existing.quantity++;
      } else {
        this.alertService.warning('Insufficient stock for this product.');
        return;
      }
    } else {
      if (product.getProductQuantity() > 0) {
        this.items.push({ itemProduct: product, quantity: 1, price: unitPrice });
      } else {
        this.alertService.error('Product is out of stock.');
        return;
      }
    }
    this.updateCart();
  }

  removeFromCart(productId: string) {
    this.items = this.items.filter(item => item.itemProduct.getProductId() !== productId);
    this.updateCart();
  }

  clearCart() {
    this.items = [];
    this.updateCart();
  }

  clearStorage() {
    this.items = [];
    if (this.isBrowser()) {
      const emptyCart: ShoppingCart = {
        itemsProduct: [],
        totalItems: 0,
        totalPrice: 0
      };
      sessionStorage.setItem('cart', JSON.stringify(emptyCart));
    }

    this.updateCart();
  }

  updateQuantity(productId: string, quantity: number) {
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

  openCart() {
    this.cartVisibility.next(true);
  }

  toggleCart() {
    this.cartVisibility.next(!this.cartVisibility.getValue());
  }

  closeCart() {
    this.cartVisibility.next(false);
  }

  // Safe browser check
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }
}