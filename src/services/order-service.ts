import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Order } from '../models/Order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) { }

  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`, { withCredentials: true }).pipe(
      // transforme le JSON reçu en instance Order
      map(data => data.map((item: any) => Order.fromJSON(item)))
    );
  }

  placeOrder(order: Order): Observable<any> {
    return this.http.post<Order>(this.baseUrl, order.toJSON(), { withCredentials: true });
  }

}
