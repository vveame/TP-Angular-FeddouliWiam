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
    if (this.isLowStock(product)) {
      return 'Stock faible - dépêchez-vous !';
    } else if (this.isRecentlyRestocked(product)) {
      return 'Récemment restocké !';
    } else {
      return null;
    }
  }

  checkAndNotifyLowStock(): void {
    this.productService.getProducts().subscribe({
      next: (products: any[]) => {  // on reçoit des JSON simples
        // transforme en instances de Product
        const productInstances = products.map(productJson => Product.fromJSON(productJson));

        // filtre avec les méthodes de Product
        const lowStockProducts = productInstances.filter(p => this.isLowStock(p));

        if (lowStockProducts.length > 0) {
          this.alertService.warning(
            `${lowStockProducts.length} produit(s) ont un stock faible`,
            5000
          );
        }
      },
      error: () => {
        this.alertService.error("Erreur lors de la vérification du stock.");
      }
    });
  }

}