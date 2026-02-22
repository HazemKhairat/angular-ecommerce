import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    isCartOpen = new BehaviorSubject<boolean>(false);

    toggleCart() {
        this.isCartOpen.next(!this.isCartOpen.value);
    }

    openCart() {
        this.isCartOpen.next(true);
    }

    closeCart() {
        this.isCartOpen.next(false);
    }
}
