import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse, User } from '../models/api.models';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1/auth';
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);
    private router = inject(Router);

    userData = new BehaviorSubject<User | null>(null);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            if (localStorage.getItem('token')) {
                this.saveUserData();
            }
        }
    }

    register(userData: object): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, userData);
    }

    login(userData: object): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/signin`, userData);
    }

    saveUserData() {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    // Map decoded token strictly to User interface if needed, 
                    // or just store what we have. API usually returns simplified data in token.
                    // For now, we'll assume the decoded token has name/id/role.
                    this.userData.next(decoded);
                } catch (e) {
                    this.logout();
                }
            }
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.userData.next(null);
        this.router.navigate(['/login']);
    }

    // Password reset flows
    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/forgotPasswords`, { email });
    }

    verifyResetCode(resetCode: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/verifyResetCode`, { resetCode });
    }

    resetPassword(data: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/resetPassword`, data);
    }
}
