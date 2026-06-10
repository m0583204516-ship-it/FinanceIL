import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  authService = inject(AuthService) as AuthService;
  private router = inject(Router);

  get isAdmin(): boolean { return this.authService.isAdmin(); }

  get currentUser() {
    const acc = this.authService.currentAccount();
    return acc ? `${acc.user.firstName} ${acc.user.lastName}` : '';
  }

  userLinks: NavItem[] = [
    { label: 'לוח בקרה', icon: 'grid', route: '/dashboard' },
    { label: 'הכנסות', icon: 'trending-up', route: '/incomes' },
    { label: 'הוצאות', icon: 'trending-down', route: '/expenses' },
    { label: 'פיקדונות', icon: 'piggy-bank', route: '/deposits' },
    { label: 'העברות', icon: 'arrow-left-right', route: '/transfers' },
    { label: 'היסטוריית עסקאות', icon: 'history', route: '/transactions' },
  ];

  adminLinks: NavItem[] = [
    { label: 'ניהול מערכת', icon: 'shield', route: '/admin' },
    // { label: 'ניהול משתמשים', icon: 'users', route: '/admin/users' },
    { label: 'ניהול חשבונות', icon: 'credit-card', route: '/admin/accounts' },
    // { label: 'כל ההעברות', icon: 'activity', route: '/admin/transfers' },
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getIcon(name: string): string {
    const icons: Record<string, string> = {
      grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
      'trending-up': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
      'trending-down': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
      'piggy-bank': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8.5 3.3 1.1 4.5C7 17.5 7 22 11 22v-1.5c1.7.5 3.3.5 5 0V22c4 0 4-4.5 4.9-5.5C21.8 15.2 22 13.8 22 13c0-5.3-7.5-6.5-11-5 .2-.6 1.5-2 3-2 0 0 1-.7.4-1z"/><circle cx="12" cy="7" r="1" fill="currentColor"/></svg>',
      'arrow-left-right': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3L4 7l4 4"/><path d="M4 7h16"/><path d="M16 21l4-4-4-4"/><path d="M20 17H4"/></svg>',
      history: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5.16"/><circle cx="12" cy="12" r="4"/><polyline points="12 8 12 12 14 14"/></svg>',
      shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      'credit-card': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      activity: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    };
    return icons[name] || '';
  }
}
