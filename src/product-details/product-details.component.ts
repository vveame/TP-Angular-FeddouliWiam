import { Component } from '@angular/core';
import { Product } from '../models/Product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product-service';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { CartService } from '../services/cart-service';
import { StockService } from '../services/stock-service';

@Component({
  selector: 'app-product-details-component',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css', '../catalog/catalog.component.css']
})
export class ProductDetailsComponent {
  product: Product | null = null;

  constructor(private cartService: CartService,
    private route: ActivatedRoute,
    private productService: ProductService,
    public stockService: StockService
  ) { }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe((productData) => {
        this.product = new Product(productData); // Convert to Product instance
      });
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.cartService.openCart();
    }
  }
}