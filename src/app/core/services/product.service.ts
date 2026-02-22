import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, Brand, SubCategory } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1';
    private http = inject(HttpClient);

    // Products
    getAllProducts(queryParams?: string): Observable<{ data: Product[] }> {
        return this.http.get<{ data: Product[] }>(`${this.baseUrl}/products${queryParams ? '?' + queryParams : ''}`);
    }

    getProductById(id: string): Observable<{ data: Product }> {
        return this.http.get<{ data: Product }>(`${this.baseUrl}/products/${id}`);
    }

    // Categories
    getAllCategories(): Observable<{ data: Category[] }> {
        return this.http.get<{ data: Category[] }>(`${this.baseUrl}/categories`);
    }

    getCategoryById(id: string): Observable<{ data: Category }> {
        return this.http.get<{ data: Category }>(`${this.baseUrl}/categories/${id}`);
    }

    // Brands
    getAllBrands(): Observable<{ data: Brand[] }> {
        return this.http.get<{ data: Brand[] }>(`${this.baseUrl}/brands`);
    }

    getBrandById(id: string): Observable<{ data: Brand }> {
        return this.http.get<{ data: Brand }>(`${this.baseUrl}/brands/${id}`);
    }

    // SubCategories
    getAllSubCategories(): Observable<{ data: SubCategory[] }> {
        return this.http.get<{ data: SubCategory[] }>(`${this.baseUrl}/subcategories`);
    }

    getSubCategoriesOnCategory(categoryId: string): Observable<{ data: SubCategory[] }> {
        return this.http.get<{ data: SubCategory[] }>(`${this.baseUrl}/categories/${categoryId}/subcategories`);
    }
}
