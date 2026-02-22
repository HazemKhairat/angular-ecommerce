import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-brands',
    standalone: true,
    imports: [NgOptimizedImage, AsyncPipe],
    templateUrl: './brands.component.html',
    styleUrls: ['./brands.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsComponent {
    private productService = inject(ProductService);
    brands$ = this.productService.getAllBrands().pipe(map(res => res.data));
}
