import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/api.models';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CurrencyPipe, NgOptimizedImage],
  templateUrl: './wishlist-page.component.html',
  styleUrls: ['./wishlist-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistPageComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  products: Product[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.wishlistService.getWishlist().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.products = response.data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load wishlist', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  removeFromWishlist(id: string) {
    this.wishlistService.removeFromWishlist(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        // Optimistically remove from local list or reload. Reloading is safer for now.
        // Or better:
        this.products = this.products.filter(p => p._id !== id);
        this.cdr.markForCheck();
      }
    });
  }

  addToCart(id: string) {
    this.cartService.addToCart(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        alert('Product added to cart');
      }
    })
  }
}
