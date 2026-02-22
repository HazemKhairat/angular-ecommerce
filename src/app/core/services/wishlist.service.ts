import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, take, tap, timer } from 'rxjs';
import { Product } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1/wishlist';
    private http = inject(HttpClient);

    // State
    wishlistCount = new BehaviorSubject<number>(0);
    wishlistList = new BehaviorSubject<string[]>([]); // Store IDs for easy checking

    constructor() {
        timer(2000).pipe(
            switchMap(() => this.getWishlist()),
            take(1)
        ).subscribe();
    }

    getWishlist(): Observable<{ count: number; data: Product[] }> {
        return this.http.get<{ count: number; data: Product[] }>(this.baseUrl).pipe(
            tap(response => {
                this.wishlistCount.next(response.count);
                const ids = response.data.map(item => item._id);
                this.wishlistList.next(ids);
            })
        );
    }

    addToWishlist(productId: string): Observable<{ status: string; message: string; data: string[] }> {
        return this.http.post<{ status: string; message: string; data: string[] }>(this.baseUrl, { productId }).pipe(
            tap(response => {
                this.wishlistCount.next(response.data.length);
                this.wishlistList.next(response.data);
            })
        );
    }

    removeFromWishlist(productId: string): Observable<{ status: string; message: string; data: string[] }> {
        return this.http.delete<{ status: string; message: string; data: string[] }>(`${this.baseUrl}/${productId}`).pipe(
            tap(response => {
                this.wishlistCount.next(response.data.length);
                this.wishlistList.next(response.data);
            })
        );
    }
}
