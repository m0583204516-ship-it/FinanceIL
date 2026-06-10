import { Component, EventEmitter, Input, Output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @Input() title = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  authService = inject(AuthService);
  router = inject(Router);

  currentUser = computed(() => {
    const acc = this.authService.currentAccount();
    return acc ? `${acc.user.firstName} ${acc.user.lastName}` : '';
  });

  accountBalance = computed(() => this.authService.currentAccount()?.balance ?? 0);

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
