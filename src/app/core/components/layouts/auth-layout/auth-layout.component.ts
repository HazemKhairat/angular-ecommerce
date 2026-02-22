import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  // User might want navbar on auth pages too, or just a clean specialized one. 
  // I'll include navbar/footer for consistency but maybe simplified. 
  // For now, same as main layout but perhaps different spacing or background.
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent { }
