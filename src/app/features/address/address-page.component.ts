import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AddressService } from '../../core/services/address.service';
import { Address } from '../../core/models/api.models';

@Component({
  selector: 'app-address-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './address-page.component.html',
  styleUrls: ['./address-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressPageComponent implements OnInit {
  private addressService = inject(AddressService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  addresses: Address[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses() {
    this.loading = true;
    this.addressService.getUserAddresses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.addresses = response.data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading addresses', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  removeAddress(id: string) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressService.removeAddress(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) => {
          this.addresses = response.data; // API returns updated list
          this.cdr.markForCheck();
        }
      });
    }
  }
}
