import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart-service';
import { ShoppingCart } from '../models/ShoppingCart';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../map/map.component';
import { Order, DeliveryAddress, OrderStatus } from '../models/Order';
import { UserService } from '../services/user-service';
import { OrderService } from '../services/order-service';
import { AlertService } from '../services/alert-service';

@Component({
  selector: 'app-order-page',
  imports: [CommonModule, FormsModule, MapComponent],
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {
  cart!: ShoppingCart;
  shippingFee = 15;  // frais par défaut minimum
  address = {
    lat: 33.5731,        // position entreprise par défaut
    lng: -7.5898,
    description: 'Company Location' // description par défaut
  };
  paymentMethod = '';
  orderConfirmed = false;
  useAddressString = false; // false = carte, true = saisie texte
  addressString = '';
  userId: string = '';

  constructor(private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private orderService: OrderService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.getUserId();

        this.cartService.cart.subscribe(cart => this.cart = cart);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            pos => {
              this.setDeliveryLocation(pos.coords.latitude, pos.coords.longitude);
            },
            err => {
              console.error("Erreur géolocalisation :", err.message);
              this.alertService.warning("Erreur géolocalisation !");
              this.updateShippingFee();
            }
          );
        } else {
          this.updateShippingFee();
        }
      } else {
        this.alertService.warning("Utilisateur non connecté");
        this.router.navigate(['/signin']);
        return;
      }
    });
  }

  get deliveryAddressDisplay(): string {
    if (this.address.description && this.address.description.trim().length > 0) {
      return this.address.description;
    } else {
      return `Latitude: ${this.address.lat}, Longitude: ${this.address.lng}`;
    }
  }

  get totalWithShipping(): number {
    return (this.cart?.totalPrice || 0) + this.shippingFee;
  }

  confirmOrder(): void {
    if (!this.paymentMethod) {
      this.alertService.error("Veuillez sélectionner une méthode de paiement.");
      return;
    }

    if (this.useAddressString) {
      if (!this.addressString.trim()) {
        this.alertService.error("Veuillez entrer une adresse valide.");
        return;
      }
      this.address.description = this.addressString.trim();
    } else {
      if (!this.address.lat || !this.address.lng) {
        this.alertService.error("Veuillez définir une position valide sur la carte.");
        return;
      }
      this.address.description = '';
    }

    const deliveryAddress: DeliveryAddress = this.useAddressString
      ? { description: this.address.description }
      : { lat: this.address.lat, lng: this.address.lng, description: '' };

    const order = new Order(
      this.userId,
      this.cart,
      this.paymentMethod,
      deliveryAddress,
      this.shippingFee,
      this.totalWithShipping,
      OrderStatus.PENDING
    );

    this.orderService.placeOrder(order).subscribe({
      next: (response) => {
        this.orderConfirmed = true;
        this.cartService.clearStorage();
        this.alertService.success("Commande confirmée avec succès !");
      },
      error: (err) => {
        console.error("Erreur lors de l'envoi de la commande", err);
        this.alertService.error("Échec de la commande. Veuillez réessayer plus tard.");
      }
    });
  }

  goBackToCart(): void {
    this.router.navigate(['/catalog']);
  }

  onLocationChanged(event: { lat: number; lng: number }): void {
    this.address.lat = event.lat;
    this.address.lng = event.lng;
    this.address.description = '';
    this.updateShippingFee();
  }

  private setDeliveryLocation(lat: number, lng: number): void {
    this.address.lat = lat;
    this.address.lng = lng;
    this.updateShippingFee();
  }

  private updateShippingFee(): void {
    const distanceKm = this.calculateDistance(
      33.5731, -7.5898,
      this.address.lat,
      this.address.lng
    );

    if (distanceKm <= 3) this.shippingFee = 15;
    else if (distanceKm <= 7) this.shippingFee = 25;
    else if (distanceKm <= 15) this.shippingFee = 40;
    else this.shippingFee = 60;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
