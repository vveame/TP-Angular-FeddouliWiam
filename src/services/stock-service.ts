import { Injectable } from '@angular/core';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  isLowStock(product: Product): boolean {
    return product.getProductQuantity() < 10;
  }

  isRecentlyRestocked(product: Product): boolean {
    const restockDate = product.getRestockDate();
    if (!restockDate) return false;

    const now = Date.now();
    const diff = now - new Date(restockDate).getTime();
    return diff <= 24 * 60 * 60 * 1000; // within 24h
  }
}