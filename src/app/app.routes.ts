import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./core/components/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/landing-page/landing-page.component').then(m => m.LandingPageComponent),
                title: 'Home'
            },

            {
                path: 'products',
                loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
            },

            {
                path: 'product/:id',
                loadComponent: () => import('./features/products/product-details/product-details.component').then(m => m.ProductDetailsComponent)
            },
            {
                path: 'categories',
                loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent)
            },

            {
                path: 'brands',
                loadComponent: () => import('./features/brands/brands.component').then(m => m.BrandsComponent), title: 'Brands'
            },
            {
                path: 'cart',
                loadComponent: () => import('./features/cart/cart-page/cart-page.component').then(m => m.CartPageComponent), title: 'Cart'
            },
            {
                path: 'checkout',
                loadComponent: () => import('./features/checkout/checkout/checkout.component').then(m => m.CheckoutComponent), title: 'Checkout'
            },
            {
                path: 'wishlist',
                loadComponent: () => import('./features/wishlist/wishlist-page.component').then(m => m.WishlistPageComponent), title: 'Wishlist'
            },
            {
                path: 'address',
                loadComponent: () => import('./features/address/address-page.component').then(m => m.AddressPageComponent), title: 'Addresses'
            },
            {
                path: 'address/add',
                loadComponent: () => import('./features/address/add-address.component').then(m => m.AddAddressComponent), title: 'Add Address'
            },
            {
                path: 'allorders',
                loadComponent: () => import('./features/orders/order-history/order-history.component').then(m => m.OrderHistoryComponent), title: 'My Orders'
            }
        ]
    },
    {
        path: '',
        loadComponent: () => import('./core/components/layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent), title: 'Login'
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent), title: 'Register'
            }
        ]
    },
    { path: '**', redirectTo: 'products' }
];
