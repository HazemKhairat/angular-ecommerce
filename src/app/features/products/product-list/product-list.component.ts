import { Component, inject, ChangeDetectionStrategy, computed, signal, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product, Category, Brand } from '../../../core/models/api.models';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, startWith, BehaviorSubject, switchMap, map, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, SkeletonLoaderComponent, NgClass, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private route = inject(ActivatedRoute);

  // Form Controls
  categoryControl = new FormControl('');
  brandControl = new FormControl('');

  ngOnInit(): void {
    // Read query params to initialize filters (e.g. from landing page)
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (params['category']) {
        this.categoryControl.setValue(params['category']);
      }
      if (params['brand']) {
        this.brandControl.setValue(params['brand']);
      }
    });
  }

  // 1. Declarative Data Fetching (Source of Truth)
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  private productsResource = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => this.productService.getAllProducts()),
      map((res: { data: Product[] }) => res.data)
    ),
    { initialValue: [] as Product[] }
  );

  private categoriesResource = toSignal(
    this.productService.getAllCategories().pipe(map((res: { data: Category[] }) => res.data)),
    { initialValue: [] as Category[] }
  );

  private brandsResource = toSignal(
    this.productService.getAllBrands().pipe(map((res: { data: Brand[] }) => res.data)),
    { initialValue: [] as Brand[] }
  );

  // 2. Optimized Wishlist Lookup (O(1))
  // First convert Observable to Signal at initialization level
  private wishlistIds = toSignal(this.wishlistService.wishlistList, { initialValue: [] as string[] });

  // Then use computed to transform the array into a Set for O(1) lookup
  private wishlistSet = computed(() => {
    const ids = this.wishlistIds();
    return new Set(ids);
  });

  // Filter Stream
  private filterState = toSignal(
    combineLatest([
      this.categoryControl.valueChanges.pipe(startWith('')),
      this.brandControl.valueChanges.pipe(startWith(''))
    ]).pipe(debounceTime(300)),
    { initialValue: ['', ''] }
  );

  // Pagination State
  currentPage = signal(1);
  pageSize = signal(6);

  // 3. ViewModel Projection (Merges Data + State + Filters)
  // Base Filtered Products (Before Pagination)
  private filteredProducts = computed(() => {
    const products = this.productsResource();
    const [selectedCategory, selectedBrand] = this.filterState()!;
    const wishlist = this.wishlistSet();

    return products.filter(product => {
      const matchCategory = selectedCategory ? product.category._id === selectedCategory : true;
      const matchBrand = selectedBrand ? product.brand._id === selectedBrand : true;
      return matchCategory && matchBrand;
    }).map(product => ({
      ...product,
      isWishlisted: wishlist.has(product._id)
    }));
  });

  // Paginated Products (For Display)
  paginatedProducts = computed(() => {
    const products = this.filteredProducts();
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return products.slice(startIndex, startIndex + size);
  });

  // Pagination Metadata
  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.pageSize()));

  // Public Signals for Template
  categories = this.categoriesResource;
  brands = this.brandsResource;
  isLoading = computed(() => this.productsResource().length === 0);

  // Pagination Methods
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleWishlist(id: string) {
    // Current logic requires checking imperative state, but we can check our optimize Set
    if (this.wishlistSet().has(id)) {
      this.wishlistService.removeFromWishlist(id).subscribe();
    } else {
      this.wishlistService.addToWishlist(id).subscribe();
    }
  }

  trackById(index: number, item: Product) {
    return item._id;
  }
}
