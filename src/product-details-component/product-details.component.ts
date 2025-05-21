import { Component } from '@angular/core';
import { Product } from '../models/Product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  product: Product | null = null;

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe((productData) => {
        this.product = new Product(productData); // Convert to Product instance
      });
    }
  }
}