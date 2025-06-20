import { Injectable } from '@angular/core';
import { Product } from '../models/Product';
import { ProductService } from './product-service';
import { AlertService } from './alert-service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private productService: ProductService,
    private alertService: AlertService
  ) { }

  isOutOfStock(product: Product): boolean {
    return product.getProductQuantity() === 0;
  }

  isLowStock(product: Product): boolean {
    return product.getProductQuantity() <= 10;
  }

  isRecentlyRestocked(product: Product): boolean {
    const restockDate = product.getRestockDate();
    if (!restockDate) return false;

    const now = Date.now();
    const diff = now - new Date(restockDate).getTime();
    return diff <= 24 * 60 * 60 * 1000; // within 24h
  }

  getStockMessage(product: Product): string | null {
    if (this.isOutOfStock(product)) {
      return 'Out of stock!';
    } else if (this.isLowStock(product)) {
      return 'Low stock - hurry up !';
    } else if (this.isRecentlyRestocked(product)) {
      return 'Recently restocked !';
    } else {
      return null;
    }
  }

  getStockStatusClass(product: Product): string {
    if (this.isOutOfStock(product)) return 'out-stock';
    if (this.isLowStock(product)) return 'low-stock';
    if (this.isRecentlyRestocked(product)) return 'restocked';
    return '';
  }

  checkAndNotifyStock(): void {
    this.productService.getProducts().subscribe({
      next: (products: any[]) => {  // on reçoit des JSON simples
        // transforme en instances de Product
        const productInstances = products.map(productJson => Product.fromJSON(productJson));

        // filtre avec les méthodes de Product
        const lowStockProducts = productInstances.filter(p => this.isLowStock(p));
        const outOfStockProducts = productInstances.filter(p => this.isOutOfStock(p));

        if (lowStockProducts.length > 0) {
          this.alertService.warning(
            `${lowStockProducts.length} product(s) have low stock.`,
            5000
          );
        }

        if (outOfStockProducts.length > 0) {
          this.alertService.error(
            `${outOfStockProducts.length} product(s) are out of stock.`,
            5000
          );
        }
      },
      error: () => {
        this.alertService.error("Error checking stock levels.");
      }
    });
  }

}