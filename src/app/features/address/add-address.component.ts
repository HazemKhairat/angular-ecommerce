import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../../core/services/address.service';

@Component({
    selector: 'app-add-address',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './add-address.component.html',
    styleUrls: ['./add-address.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAddressComponent {
    private fb = inject(FormBuilder);
    private addressService = inject(AddressService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);

    addressForm: FormGroup = this.fb.group({
        alias: ['', Validators.required],
        details: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]], // Egyptian phone validation
        city: ['', Validators.required],
        postalCode: ['']
    });

    isLoading = false;

    onSubmit() {
        if (this.addressForm.valid) {
            this.isLoading = true;
            this.addressService.addAddress(this.addressForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.cdr.markForCheck();
                    this.router.navigate(['/address']);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.cdr.markForCheck();
                    console.error(err);
                    alert('Failed to add address');
                }
            });
        }
    }
}
