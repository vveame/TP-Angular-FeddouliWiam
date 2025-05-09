import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatalogComponent } from "../catalog-component/catalog.component";
import { Product } from '../models/Product';
import { ProductDetailsComponent } from "../product-details-component/product-details.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CatalogComponent, ProductDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TP2';

  selectedProduct: Product | null = null;
  onProductSelected(product: Product) {
    if (this.selectedProduct === product)
      this.selectedProduct = null; // Toggle: cacher si déjà sélectionné
    else
    this.selectedProduct = product; // Afficher si différent
  }
}
