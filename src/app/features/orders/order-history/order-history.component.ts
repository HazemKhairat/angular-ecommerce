import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe, DatePipe, NgOptimizedImage, AsyncPipe } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgOptimizedImage, AsyncPipe],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  orders$ = this.authService.userData.pipe(
    switchMap(user => user ? this.orderService.getUserOrders(user._id) : of([]))
  );
}
