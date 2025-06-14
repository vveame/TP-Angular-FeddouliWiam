import { Component, OnInit } from '@angular/core';
import { Product } from '../models/Product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product-service';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart-service';
import { ShoppingCartComponent } from "../shopping-cart/shopping-cart.component";

@Component({
  selector: 'app-catalog-component',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ShoppingCartComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  selectedProduct: Product | null = null;
  myValue: string = "";
  filter: string = "";
  products: Product[] = [];
  allProducts: Product[] = [];
  showCart: boolean = false;

  constructor(private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    // Fetch all products first
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.allProducts = data.map((item: any) => new Product(item));

      // Read query params and apply filter
      this.route.queryParams.subscribe((params) => {
        this.filter = params['filter'] ?? '';
        this.applyFilter();
      });
    });
  }

  selectProduct(product: Product) {
    if (this.selectedProduct === product)
      this.selectedProduct = null;
    else
      this.selectedProduct = product;
  } 

  applyFilter() {
    if (this.filter === '') {
      this.products = this.allProducts;
    } else {
      this.products = this.allProducts.filter(
        (product: Product) => product.getProductCategory() === this.filter
      );
    }
  }

  goToProductDetails(product: Product) {
    this.router.navigate(['/product-details', product.getProductId()], {
    state: { product }
  });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    // Optional: auto-open cart
    this.showCart = true;
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

}
