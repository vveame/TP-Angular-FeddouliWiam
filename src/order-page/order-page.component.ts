import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart-service';
import { ShoppingCart } from '../models/ShoppingCart';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../map/map.component';

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

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.cartService.cart.subscribe(cart => this.cart = cart);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.setDeliveryLocation(pos.coords.latitude, pos.coords.longitude);
        },
        err => {
          console.error("Erreur géolocalisation :", err.message);
          this.updateShippingFee();
        }
      );
    } else {
      this.updateShippingFee();
    }
  }

  get totalWithShipping(): number {
    return (this.cart?.totalPrice || 0) + this.shippingFee;
  }

  confirmOrder(): void {
    if (!this.paymentMethod) {
      alert("Veuillez sélectionner une méthode de paiement");
      return;
    }

    if (this.useAddressString) {
      if (!this.addressString.trim()) {
        alert("Veuillez entrer une adresse valide");
        return;
      }
      this.address.description = this.addressString.trim();
    } else {
      if (!this.address.lat || !this.address.lng) {
        alert("Veuillez définir une position valide sur la carte");
        return;
      }
      // Garder la description si elle existe, sinon peut rester vide ou "Localisation choisie"
    }

    const orderData = {
      cart: this.cart,
      paymentMethod: this.paymentMethod,
      deliveryAddress: this.useAddressString
        ? { description: this.address.description }
        : this.address,
      shippingFee: this.shippingFee,
      totalPrice: this.totalWithShipping
    };

    // TODO: envoyer orderData au backend

    this.orderConfirmed = true;
    this.cartService.clearStorage();
  }

  goBackToCart(): void {
    this.router.navigate(['/catalog']);
  }

  onLocationChanged(event: { lat: number; lng: number }): void {
    this.address.lat = event.lat;
    this.address.lng = event.lng;
    if (!this.address.description) {
      this.address.description = ''; // ou 'Localisation choisie' si tu veux une valeur par défaut
    }
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
