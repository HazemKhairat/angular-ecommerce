import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { Cart } from '../../../core/models/api.models';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, NgOptimizedImage],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPageComponent implements OnInit {
  cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  loader = this.cartService.getLoggedUserCart().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

  updatingItems = signal<Set<string>>(new Set<string>());

  ngOnInit() {
    // Just ensure we have valid data if not loaded? 
    // Actually loader property subscription usually enough but we might want error handling.
    // Better:
    this.cartService.getLoggedUserCart().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      error: (err) => console.log(err)
    });
  }

  updateCount(id: string, count: number) {
    if (count > 0 && !this.updatingItems().has(id)) {
      this.updatingItems.update(set => {
        const newSet = new Set(set);
        newSet.add(id);
        return newSet;
      });
      this.cartService.updateCartItemQuantity(id, count).pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.updatingItems.update(set => {
            const newSet = new Set(set);
            newSet.delete(id);
            return newSet;
          });
        })
      ).subscribe();
    }
  }

  removeItem(id: string) {
    if (!this.updatingItems().has(id)) {
      this.updatingItems.update(set => {
        const newSet = new Set(set);
        newSet.add(id);
        return newSet;
      });
      this.cartService.removeCartItem(id).pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.updatingItems.update(set => {
            const newSet = new Set(set);
            newSet.delete(id);
            return newSet;
          });
        })
      ).subscribe();
    }
  }
}
