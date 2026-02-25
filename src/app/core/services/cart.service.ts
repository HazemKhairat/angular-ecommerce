import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart } from '../models/api.models';

interface CartState {
    data: Cart | null;
    loaded: boolean;
    error: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1/cart';
    private http = inject(HttpClient);

    // Core State Signal
    private state = signal<CartState>({
        data: null,
        loaded: false,
        error: null
    });

    // Public Signals (Selectors)
    cartData = computed(() => this.state().data);
    cartNumber = computed(() => this.state().data?.products.length ?? 0);
    cartId = computed(() => this.state().data?._id ?? null);

    constructor() { }

    getLoggedUserCart(): Observable<{ status: string; data: Cart }> {
        return this.http.get<{ status: string; data: Cart }>(this.baseUrl).pipe(
            tap({
                next: (res) => this.setCart(res.data),
                error: (err) => this.state.update(s => ({ ...s, error: err.message, loaded: true }))
            })
        );
    }

    addToCart(productId: string): Observable<{ status: string; message: string; numOfCartItems: number; data: Cart }> {
        return this.http.post<{ status: string; message: string; numOfCartItems: number; data: Cart }>(
            this.baseUrl,
            { productId }
        ).pipe(
            tap(res => {
                this.setCart(res.data);
                this.refreshCart(); // Refresh to get populated product data
            })
        );
    }

    removeCartItem(id: string): Observable<{ status: string; numOfCartItems: number; data: Cart }> {
        return this.http.delete<{ status: string; numOfCartItems: number; data: Cart }>(`${this.baseUrl}/${id}`).pipe(
            tap(res => {
                this.setCart(res.data);
                this.refreshCart(); // Refresh to ensure data consistency
            })
        );
    }

    updateCartItemQuantity(id: string, count: number): Observable<{ status: string; numOfCartItems: number; data: Cart }> {
        return this.http.put<{ status: string; numOfCartItems: number; data: Cart }>(`${this.baseUrl}/${id}`, { count }).pipe(
            tap(res => {
                this.setCart(res.data);
                this.refreshCart(); // Refresh to get populated product data
            })
        );
    }

    clearCart(): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(this.baseUrl).pipe(
            tap(() => {
                this.state.update(s => ({ ...s, data: null, loaded: true }));
            })
        );
    }

    private setCart(data: Cart) {
        this.state.update(s => ({ ...s, data, loaded: true, error: null }));
    }

    refreshCart() {
        this.getLoggedUserCart().subscribe({
            error: (err) => console.log('Cart fetch failed', err)
        });
    }

    // Checkout Session
    checkout(cartId: string, shippingAddress: any): Observable<{ status: string; session: { url: string } }> {
        return this.http.post<{ status: string; session: { url: string } }>(
            `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`,
            { shippingAddress }
        );
    }
}
