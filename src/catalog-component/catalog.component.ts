import { Component } from '@angular/core';
import { Product } from '../models/Product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';
import { ProductDetailsComponent } from "../product-details-component/product-details.component";
import { Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-catalog-component',
  standalone: true,
  imports: [FormsModule, CommonModule, ProductDetailsComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  @Input() selectedProduct: Product | null = null;
  @Output() productSelected = new EventEmitter<Product>();

  products: Product[] = [];
  private baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getProducts().subscribe((data: Product[]) => {
      this.products = data.map(item => new Product(item));
    });
  }

  getProducts() : Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl + 'api/products');
  }

  selectProduct(product: Product) {
    this.productSelected.emit(product);
  }
}
