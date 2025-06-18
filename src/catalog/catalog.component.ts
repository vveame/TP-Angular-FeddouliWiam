import { Component, OnInit } from '@angular/core';
import { Product } from '../models/Product';
import { ProductService } from '../services/product-service';
import { CartService } from '../services/cart-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { StockService } from '../services/stock-service';
import { AlertService } from '../services/alert-service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  filter: string = '';
  products: Product[] = [];
  allProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    public stockService: StockService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.allProducts = data.map(item => new Product(item));
        this.route.queryParams.subscribe(params => {
          this.filter = params['filter'] ?? '';
          const search = params['search'] ?? '';
          this.applyFilter(this.filter, search);
        });
      },
      error: () => {
        this.alertService.error('Erreur lors du chargement des produits.');
      }
    });
  }

  applyFilter(filter: string, search: string) {
    this.products = this.allProducts.filter(product =>
      (filter === '' || product.getProductCategory() === filter) &&
      (search === '' || product.getProductTitle().toLowerCase().includes(search.toLowerCase()))
    );
  }

  goToProductDetails(product: Product) {
    this.router.navigate(['/product-details', product.getProductId()], { state: { product } });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.alertService.success(`Produit "${product.getProductTitle()}" ajouté au panier.`);
  }
}
