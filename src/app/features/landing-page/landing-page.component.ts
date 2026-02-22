import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductCardComponent } from '../products/product-card/product-card.component';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, RouterLink, ProductCardComponent],
    templateUrl: './landing-page.component.html',
    styles: [`
    .hero-gradient {
      background: radial-gradient(circle at top right, rgba(79, 70, 229, 0.1) 0%, transparent 60%),
                  radial-gradient(circle at bottom left, rgba(129, 140, 248, 0.05) 0%, transparent 50%);
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
  `]
})
export class LandingPageComponent {
    private productService = inject(ProductService);
    private wishlistService = inject(WishlistService);

    // 1. Fetch Categories
    private categoriesResource = toSignal(this.productService.getAllCategories(), { initialValue: { data: [] } });

    categories = computed(() => this.categoriesResource().data.slice(0, 4));
    totalCategories = computed(() => this.categoriesResource().data.length);

    // 2. Fetch Featured Products & Total Count
    private productsResource = toSignal(
        this.productService.getAllProducts('limit=3&sort=-createdAt'),
        { initialValue: { data: [], metadata: { numberOfPages: 0 } } as any }
    );

    featuredProducts = computed(() => this.productsResource().data);
    // Routermisr API often returns total count in a results property or similar
    totalProducts = toSignal(
        this.productService.getAllProducts().pipe(map(res => (res as any).results || res.data.length)),
        { initialValue: 0 }
    );

    // 3. Fetch Brands Count
    totalBrands = toSignal(
        this.productService.getAllBrands().pipe(map(res => res.data.length)),
        { initialValue: 0 }
    );

    // 4. Wishlist State Management
    private wishlistIds = toSignal(this.wishlistService.wishlistList, { initialValue: [] as string[] });

    private wishlistSet = computed(() => new Set(this.wishlistIds()));

    // 5. Map Products with Wishlist Status
    productsWithWishlist = computed(() => {
        const products = this.featuredProducts();
        const wishlist = this.wishlistSet();
        return products.map((product: any) => ({
            ...product,
            isWishlisted: wishlist.has(product._id)
        }));
    });

    features = [
        { title: 'Premium Quality', description: 'Handpicked items from top-tier global brands.', icon: 'M5 13l4 4L19 7' },
        { title: 'Secure Payment', description: 'Your transactions are protected by industry-leading security.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { title: 'Fast Delivery', description: 'Experience the fastest shipping in the e-commerce world.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
    ];

    toggleWishlist(id: string) {
        if (this.wishlistSet().has(id)) {
            this.wishlistService.removeFromWishlist(id).subscribe();
        } else {
            this.wishlistService.addToWishlist(id).subscribe();
        }
    }
}
