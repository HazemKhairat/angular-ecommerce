import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  authService = inject(AuthService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  isLoading = false;
  apiError: string = '';

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{5,10}$/)]), // Example pattern matching common test API requirements
    rePassword: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]) // Egyptian format for RouteMisr API usually
  });

  onSubmit() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.rePassword) {
        this.apiError = "Passwords do not match";
        return;
      }
      this.isLoading = true;
      this.apiError = '';
      this.authService.register(this.registerForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.cdr.markForCheck();
          if (res.message === 'success') {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.apiError = err.error.message || 'Registration failed';
          this.cdr.markForCheck();
        }
      });
    }
  }
}
