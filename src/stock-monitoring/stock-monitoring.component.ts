import { Component, OnInit } from '@angular/core';
import { Product } from '../models/Product';
import { StockService } from '../services/stock-service';
import { AlertService } from '../services/alert-service';
import { ProductService } from '../services/product-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { SearchService } from '../services/search-service';

@Component({
  selector: 'app-stock-monitoring',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './stock-monitoring.component.html',
  styleUrl: './stock-monitoring.component.css'
})
export class StockMonitoringComponent implements OnInit {
  products: Product[] = [];
  lowStockProducts: Product[] = [];
  restockQuantities: { [productId: string]: number } = {};
  selectedCategory: string = '';
  categories: string[] = [];
  selectedStockStatus: string = ''; // '' = tous
  stockStatusOptions: string[] = ['low', 'out', 'restocked', 'all'];
  searchTerm: string = '';

  constructor(
    public stockService: StockService,
    private alertService: AlertService,
    private productService: ProductService,
    private router: Router,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.fetchProducts();

    this.searchService.query$.subscribe(query => {
      this.searchTerm = query.toLowerCase();
    });
  }

  getRestockQty(productId: string): number {
    return this.restockQuantities[productId] || 1;
  }

  setRestockQty(productId: string, qty: number) {
    this.restockQuantities[productId] = qty;
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data.map(item => Product.fromJSON(item));
        this.categories = Array.from(new Set(this.products.map(p => p.getProductCategory())));

        // Détection des stocks faibles après chargement
        this.lowStockProducts = this.products.filter(product =>
          this.stockService.isLowStock(product)
        );

        this.lowStockProducts.forEach(p =>
          this.alertService.warning(`Low stock for ${p.getProductTitle()}`)
        );
      },
      error: (err) => {
        this.alertService.error("Error loading products.");
        console.error(err);
      }
    });
  }

  restock(id: string): void {
    const qty = this.getRestockQty(id);

    if (!qty || qty <= 0) {
      this.alertService.warning("Please enter a valid quantity.");
      return;
    }
    this.productService.updateProductStock(id, qty).subscribe({
      next: (product) => {
        // Mettre à jour le produit local dans la liste
        const index = this.products.findIndex(p => p.getProductId() === product.getProductId());
        if (index !== -1) {
          this.products[index] = product;
        }

        this.alertService.success(`Product ${product.getProductTitle()} restocked`);
      },
      error: err => {
        this.alertService.error(err.message || "Error during restocking.");
      }
    });
  }

  emptyStock(id: string): void {
    this.productService.updateProductStock(id, 0).subscribe({
      next: (product) => {
        // Mettre à jour le produit local dans la liste
        const index = this.products.findIndex(p => p.getProductId() === product.getProductId());
        if (index !== -1) {
          this.products[index] = product;
        }

        this.alertService.success(`Stock for ${product.getProductTitle()} emptied.`);
      },
      error: err => {
        this.alertService.error(err.message || "Error during emptying stock.");
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/profil']);
  }

  get filteredProducts(): Product[] {
    return this.products
      .filter(p => !this.selectedCategory || p.getProductCategory() === this.selectedCategory)
      .filter(p => this.filterByStockStatus(p))
      .filter(p =>
        !this.searchTerm || p.getProductTitle().toLowerCase().includes(this.searchTerm)
      );
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
  }

  filterByStockStatus(product: Product): boolean {
    switch (this.selectedStockStatus) {
      case 'low':
        return this.stockService.isLowStock(product) && product.getProductQuantity() > 0;
      case 'out':
        return product.getProductQuantity() === 0;
      case 'restocked':
        return this.stockService.isRecentlyRestocked(product);
      default:
        return true; // all
    }
  }

}
