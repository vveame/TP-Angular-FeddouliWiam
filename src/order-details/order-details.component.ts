import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order-service';
import { ProductService } from '../services/product-service';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { AlertService } from '../services/alert-service';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order!: Order;
  productDetails: { [productId: string]: Product } = {};
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe({
        next: order => {
          this.order = order;
          console.log(order);
          this.loadProductDetails(order);
        },
        error: err => {
          this.alertService.error('Error retrieving order.');
        }
      });
    }
  }

  private loadProductDetails(order: Order): void {
    const productIds = order.getItems().itemsProduct.map(item => item.itemProduct.getProductId());

    // Charger les détails de chaque produit
    productIds.forEach(productId => {
      this.productService.getProductById(productId).subscribe({
        next: product => {
          this.productDetails[productId] = product;
        },
        error: err => {
          this.alertService.warning(`Unable to load product ${productId}`);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/profil']);
  }
}