import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.cdr.markForCheck();
          if (res.message === 'success') {
            localStorage.setItem('token', res.token);
            this.authService.saveUserData();
            this.router.navigate(['/products']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.markForCheck();
          alert(err.error.message || 'Login failed');
        }
      });
    }
  }
}
