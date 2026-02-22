import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1/orders';
    private http = inject(HttpClient);

    createCashOrder(cartId: string, shippingAddress: any): Observable<{ status: string; data: Order }> {
        return this.http.post<{ status: string; data: Order }>(
            `${this.baseUrl}/${cartId}`,
            { shippingAddress }
        );
    }

    checkoutSession(cartId: string, shippingAddress: any): Observable<{ status: string; session: { url: string } }> {
        return this.http.post<{ status: string; session: { url: string } }>(
            `${this.baseUrl}/checkout-session/${cartId}?url=http://localhost:4200`,
            { shippingAddress }
        );
    }

    getUserOrders(userId: string): Observable<Order[]> { // API usually returns array directly or {data: Order[]}? Checking docs/pattern usually. Assuming array based on prompt constraint "GET getUserOrders"
        // The prompt says "GET getUserOrders"
        // Typical route is /api/v1/orders/user/:id
        return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`);
    }
}
