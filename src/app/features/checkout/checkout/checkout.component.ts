import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CartService } from '../../../core/services/cart.service';
import { AddressService } from '../../../core/services/address.service';
import { OrderService } from '../../../core/services/order.service';
import { Address } from '../../../core/models/api.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  addressService = inject(AddressService);
  orderService = inject(OrderService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  addresses: Address[] = [];

  // Main form
  checkoutForm = new FormGroup({
    selectedAddressId: new FormControl(''), // If empty, use newAddressForm
    paymentMethod: new FormControl('cash', Validators.required)
  });

  // Sub-form for new address
  newAddressForm = new FormGroup({
    details: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    city: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.addressService.getUserAddresses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.addresses = res.data;
      this.cdr.markForCheck();
      // Set validation for newAddressForm based on selection?
      // Simple approach: Check in submit. Or use custom validator.
      // For now, let's just validte manually in submit or rely on form default.
      // Actually, if selectedAddressId is present, we ignore newAddressForm.
    });

    // Toggle validators based on selection
    this.checkoutForm.get('selectedAddressId')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(val => {
      if (val) {
        this.newAddressForm.disable(); // Disable new address inputs if existing selected
      } else {
        this.newAddressForm.enable();
      }
    });
  }

  get paymentMethod() {
    return this.checkoutForm.get('paymentMethod')?.value;
  }

  handleOrder() {
    const cartId = this.cartService.cartId();
    if (!cartId) return;

    let shippingAddress;
    const selectedId = this.checkoutForm.get('selectedAddressId')?.value;

    if (selectedId) {
      // Find the address object or just send ID? API usually expects object for shippingAddress in /orders endpoint param
      // Wait, the API spec says "shippingAddress" in body.
      // Usually for this specific API (Route/Ecommerce), it takes the object `details`, `phone`, `city`.
      // So we need to find the address data if selected from list.
      const addr = this.addresses.find(a => a._id === selectedId);
      if (addr) {
        shippingAddress = {
          details: addr.details,
          phone: addr.phone,
          city: addr.city
        };
      }
    } else {
      if (this.newAddressForm.invalid) {
        this.newAddressForm.markAllAsTouched();
        return;
      }
      shippingAddress = this.newAddressForm.value;
    }

    if (this.paymentMethod === 'cash') {
      this.orderService.createCashOrder(cartId, shippingAddress).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          alert('Order Placed Successfully!');
          this.cartService.clearCart().subscribe(); // Reset cart state
          this.cdr.markForCheck();
          this.router.navigate(['/allorders']); // Redirect to orders
        },
        error: (err) => {
          console.error(err);
          this.cdr.markForCheck();
        }
      });
    } else {
      this.orderService.checkoutSession(cartId, shippingAddress).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            window.location.href = res.session.url;
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.cdr.markForCheck();
        }
      });
    }
  }
}
