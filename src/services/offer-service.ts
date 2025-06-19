import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Offer } from '../models/Offer';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = 'http://localhost:3000/api/offers';

  constructor(private http: HttpClient) {}

  getOffers(): Observable<Offer[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => Offer.fromJSON(item)))
    );
  }

  getOffer(id: string): Observable<Offer> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(data => Offer.fromJSON(data))
    );
  }

  createOffer(offer: Offer): Observable<Offer> {
    return this.http.post<any>(this.apiUrl, offer.toJSON(), { withCredentials: true }).pipe(
      map(data => Offer.fromJSON(data))
    );
  }

  updateOffer(offer: Offer): Observable<Offer> {
    return this.http.put<any>(`${this.apiUrl}/${offer.getId()}`, offer.toJSON(), { withCredentials: true }).pipe(
      map(data => Offer.fromJSON(data))
    );
  }

  deleteOffer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
