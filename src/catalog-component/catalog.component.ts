import { Component } from '@angular/core';
import { Product } from '../models/Product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';
import { ProductDetailsComponent } from "../product-details-component/product-details.component";
import { Input } from '@angular/core';

@Component({
  selector: 'app-catalog-component',
  standalone: true,
  imports: [FormsModule, CommonModule, ProductDetailsComponent, ProductDetailsComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  @Input() selectedProduct: Product | null = null;
  @Output() productSelected = new EventEmitter<Product>();

  products: Product[] = [
    new Product(1, 'Clavier Gamer', 300, 4, 'assets/images/clavier.png'),
    new Product(2, 'Souris Logitech', 150, 1, 'assets/images/souris.png'),
    new Product(3, 'Écran 24', 1200, 100, 'assets/images/ecran.png'),
    new Product(4, 'Ordinateur Portable', 7000, 2000, 'assets/images/portable.png'),
    new Product(5, 'Tapis de souris', 50, 40, 'assets/images/tapis.png'),
  ];

  selectProduct(product: Product) {
    this.productSelected.emit(product);
  }
}
