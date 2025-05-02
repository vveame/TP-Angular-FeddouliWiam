import { Component, OnInit } from '@angular/core';
import { Product } from '../models/Product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';
import { ProductDetailsComponent } from "../product-details-component/product-details.component";
import { Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ProductService } from '../services/product-service';

@Component({
  selector: 'app-catalog-component',
  standalone: true,
  imports: [FormsModule, CommonModule, ProductDetailsComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  @Input() selectedProduct: Product | null = null;
  @Output() productSelected = new EventEmitter<Product>();

  products: Product[] = [];

  constructor(private ProductService: ProductService) {
  }

  ngOnInit() {
    this.ProductService.getProducts().subscribe((data: Product[]) => {
      this.products = data.map((item: any) => new Product(item));
    }
    );
  }

  selectProduct(product: Product) {
    this.productSelected.emit(product);
  }
}
