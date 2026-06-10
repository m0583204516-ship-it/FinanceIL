import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);

  idAccount = '';
  password = '';
  firstName = '';
  lastName = '';
  phone = '';
  error = '';
  loading = false;

  register() {
    this.error = '';
    if (!this.idAccount || !this.password || !this.firstName || !this.lastName) {
      this.error = 'נא למלא את כל השדות החובה';
      return;
    }
    const id = parseInt(this.idAccount);
    if (isNaN(id)) { this.error = 'מספר חשבון לא תקין'; return; }
    this.loading = true;
    const acc = { idAccount: id, password: this.password, balance: 0, user: { idUser: '', firstName: this.firstName, lastName: this.lastName, phone: this.phone }, type: 'PRIVATE', rool: 'USER' } as any;
    this.accountService.add(acc).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/login']); },
      error: () => { this.loading = false; this.error = 'שגיאה בהרשמה. נסה שוב מאוחר יותר.'; }
    });
  }

  cancel() { this.router.navigate(['/login']); }
}
