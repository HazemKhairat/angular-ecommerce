export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    wishlist?: string[];
    addresses?: Address[];
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface SubCategory {
    _id: string;
    name: string;
    slug: string;
    category: string; // ID of the category
}

export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface Product {
    _id: string;
    title: string;
    slug: string;
    description: string;
    quantity: number;
    price: number;
    imageCover: string;
    images?: string[];
    category: Category;
    brand: Brand;
    ratingsAverage: number;
    ratingsQuantity: number;
}

export interface Address {
    _id?: string;
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode?: string;
}

export interface CartItem {
    _id: string;
    product: Product;
    price: number;
    count: number;
}

export interface Cart {
    _id: string;
    cartOwner: string;
    products: CartItem[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalCartPrice: number;
}

export interface Order {
    _id: string;
    createdAt: string;
    shippingAddress: Address;
    taxPrice: number;
    shippingPrice: number;
    totalOrderPrice: number;
    paymentMethodType: 'cash' | 'card';
    isPaid: boolean;
    isDelivered: boolean;
    user: User;
    cartItems: CartItem[];
}
