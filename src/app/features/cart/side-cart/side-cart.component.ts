import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-side-cart',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterLink, NgOptimizedImage], // AsyncPipe for observable binding
  templateUrl: './side-cart.component.html',
  styleUrls: ['./side-cart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideCartComponent {
  layoutService = inject(LayoutService);
  cartService = inject(CartService);
  
}
