import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product } from '../../../core/models/api.models';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [CurrencyPipe, RouterLink, NgOptimizedImage],
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private cartService = inject(CartService);
    private wishlistService = inject(WishlistService);
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);

    product: Product | null = null;
    isLoading = true;
    quantity = 1;
    isWishlisted = false;

    ngOnInit() {
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
            const id = params['id'];
            if (id) {
                this.loadProduct(id);
            }
        });

        this.wishlistService.wishlistList.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(ids => {
            if (this.product) {
                this.isWishlisted = ids.includes(this.product._id);
                this.cdr.markForCheck();
            }
        });
    }

    loadProduct(id: string) {
        this.isLoading = true;
        this.productService.getProductById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (res) => {
                this.product = res.data;
                this.isWishlisted = this.wishlistService.wishlistList.value.includes(this.product._id);
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
                this.cdr.markForCheck();
            }
        });
    }

    addToCart() {
        if (!this.product) return;
        // The API addToCart doesn't take quantity directly usually in this schema, 
        // it's usually 1 item per call or we'd need to loop or use update.
        // For now we'll just add it once and then maybe update quantity if needed.
        // Actually, most simple APIs just add 1.
        this.cartService.addToCart(this.product._id).subscribe({
            next: (res) => {
                if (res.status === 'success') {
                    // State updated automatically by signal
                }
            }
        });
    }

    toggleWishlist() {
        if (!this.product) return;
        if (this.isWishlisted) {
            this.wishlistService.removeFromWishlist(this.product._id).subscribe();
        } else {
            this.wishlistService.addToWishlist(this.product._id).subscribe();
        }
    }
}
