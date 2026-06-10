import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private router = inject(Router);

  password = '';
  email = '';
  loading = false;
  error = '';
  currentYear = new Date().getFullYear();

  constructor() { console.log('LoginComponent constructed'); }

  login() {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'אנא מלא את כל השדות';
      return;
    }
    this.loading = true;
    this.accountService.login(this.email, this.password).subscribe({
      next: (account) => {
        this.loading = false;
        if (account) {
          this.authService.login(account);
          const target = account.rool === 'ADMIN' ? '/admin' : '/dashboard';
          this.router.navigate([target]);
        } else {
          this.error = 'סיסמה או אימייל שגויים';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'אימייל/סיסמה שגויים. בדוק את הפרטים ונסה שנית.';
      },
    });
  }
}
