import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../../core/models/api.models';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, NgOptimizedImage],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() isWishlisted = false;
  @Input() index!: number;
  @Output() wishlistToggle = new EventEmitter<string>();
  isPriorityImage = false;

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  cartService = inject(CartService);

  ngOnInit() {
    this.isPriorityImage = this.index < 4;
    this.cdr.markForCheck();
  }

  addToCart(event: MouseEvent) {
    event.stopPropagation();
    this.cartService.addToCart(this.product._id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  onWishlistToggle(event: MouseEvent) {
    event.stopPropagation();
    this.wishlistToggle.emit(this.product._id);
  }
}
