import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1/addresses';
    private http = inject(HttpClient);

    getUserAddresses(): Observable<{ status: string; results: number; data: Address[] }> {
        return this.http.get<{ status: string; results: number; data: Address[] }>(this.baseUrl);
    }

    addAddress(address: Address): Observable<{ status: string; message: string; data: Address[] }> {
        return this.http.post<{ status: string; message: string; data: Address[] }>(this.baseUrl, address);
    }

    removeAddress(addressId: string): Observable<{ status: string; message: string; data: Address[] }> {
        return this.http.delete<{ status: string; message: string; data: Address[] }>(`${this.baseUrl}/${addressId}`);
    }

    getSpecificAddress(addressId: string): Observable<{ status: string; data: Address }> {
        return this.http.get<{ status: string; data: Address }>(`${this.baseUrl}/${addressId}`);
    }
}
