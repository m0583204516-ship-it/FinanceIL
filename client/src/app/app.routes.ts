import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/shared/layout.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', loadComponent: () => import('./components/login/register.component').then(m => m.RegisterComponent) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/user/user-dashboard.component').then(m => m.UserDashboardComponent),
      },
      {
        path: 'incomes',
        loadComponent: () => import('./components/user/incomes.component').then(m => m.IncomesComponent),
      },
      {
        path: 'expenses',
        loadComponent: () => import('./components/user/expenses.component').then(m => m.ExpensesComponent),
      },
      {
        path: 'deposits',
        loadComponent: () => import('./components/user/deposits.component').then(m => m.DepositsComponent),
      },
      {
        path: 'transfers',
        loadComponent: () => import('./components/user/transfers.component').then(m => m.TransfersComponent),
      },
      {
        path: 'transactions',
        loadComponent: () => import('./components/user/transactions.component').then(m => m.TransactionsComponent),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'admin/users',
        canActivate: [adminGuard],
        loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'admin/accounts',
        canActivate: [adminGuard],
        loadComponent: () => import('./components/admin/admin-accounts.component').then(m => m.AdminAccountsComponent),
      },
      {
        path: 'admin/transfers',
        canActivate: [adminGuard],
        loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
