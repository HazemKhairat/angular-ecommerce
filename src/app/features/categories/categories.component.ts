import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [NgOptimizedImage, AsyncPipe],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {
    private productService = inject(ProductService);
    categories$ = this.productService.getAllCategories().pipe(map(res => res.data));
}
