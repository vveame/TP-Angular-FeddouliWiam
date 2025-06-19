import { Injectable } from '@angular/core';
import { OfferService } from './offer-service';
import { Offer } from '../models/Offer';
import { Product } from '../models/Product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private activeOffers: Offer[] = [];
  private offers$ = new BehaviorSubject<Offer[]>([]);

  constructor(private offerService: OfferService) {
    this.loadActiveOffers();
  }

  loadActiveOffers() {
    this.offerService.getOffers().subscribe({
      next: (offers) => {
        this.activeOffers = offers.filter(o => o.isActiveNow());
        this.offers$.next(this.activeOffers);
      }});
  }

  getOffersObservable() {
    return this.offers$.asObservable();
  }

  getDiscountedPrice(product: Product): number {
    const matchingOffers = this.activeOffers.filter(o => o.appliesToProduct(product.getProductId()));
    if (matchingOffers.length === 0) return product.getProductPrice();

    const bestOffer = matchingOffers.reduce((prev, curr) =>
      prev.getDiscountPercent() > curr.getDiscountPercent() ? prev : curr
    );

    const discount = (product.getProductPrice() * bestOffer.getDiscountPercent()) / 100;
    return product.getProductPrice() - discount;
  }

  hasDiscount(product: Product): boolean {
    return this.getDiscountedPrice(product) < product.getProductPrice();
  }
}