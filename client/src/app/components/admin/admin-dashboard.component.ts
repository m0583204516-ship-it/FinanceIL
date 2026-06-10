import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AccountService } from '../../services/account.service';
import { TransferenceService } from '../../services/transference.service';
import { IncomeService } from '../../services/income.service';
import { ExpenseService } from '../../services/expense.service';
import { User, Account, Transference } from '../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  pageTitle = 'ניהול מערכת';

  private userService = inject(UserService);
  private accountService = inject(AccountService);
  private transferenceService = inject(TransferenceService);
  private incomeService = inject(IncomeService);
  private expenseService = inject(ExpenseService);

  users: User[] = [];
  accounts: Account[] = [];
  transferences: Transference[] = [];
  loading = true;

  userSearch = '';
  transferFilter = 'all';

  showAddUserModal = false;
  showDeleteConfirm = false;
  selectedUser: User | null = null;

  newUser: Partial<User> = { idUser: '', firstName: '', lastName: '', phone: '', email: '' };

  systemStats = {
    dailyActiveUsers: [42, 38, 55, 61, 48, 70, 65],
    apiCalls: [1200, 980, 1450, 1600, 1100, 1800, 1650],
    days: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
  };

  ngOnInit() {
    this.loading = true;
    Promise.all([
      firstValueFrom(this.userService.getAll()),
      firstValueFrom(this.accountService.getAll()),
      firstValueFrom(this.transferenceService.getAll()),
    ]).then(([users, accounts, transferences]) => {
      this.users = users || this.mockUsers;
      this.accounts = accounts || this.mockAccounts;
      this.transferences = transferences || this.mockTransferences;
      this.loading = false;
    }).catch(() => {
      this.users = this.mockUsers;
      this.accounts = this.mockAccounts;
      this.transferences = this.mockTransferences;
      this.loading = false;
    });
  }

  get filteredUsers(): User[] {
    if (!this.userSearch) return this.users;
    const q = this.userSearch.toLowerCase();
    return this.users.filter((u: User) =>
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.idUser.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  }

  get filteredTransferences(): Transference[] {
    if (this.transferFilter === 'high') return this.transferences.filter(t => t.amount >= 10000);
    return this.transferences;
  }

  get totalVolume(): number { return this.transferences.reduce((s, t) => s + t.amount, 0); }
  get totalLiquidity(): number { return this.accounts.reduce((s, a) => s + a.balance, 0); }
  get adminCount(): number { return this.accounts.filter(a => a.rool === 'ADMIN').length; }

  getUserAccounts(userId: string): Account[] { return this.accounts.filter(a => a.user?.idUser === userId); }
  getUserBalance(userId: string): number { return this.getUserAccounts(userId).reduce((s, a) => s + a.balance, 0); }
  getMaxStat(arr: number[]): number { return Math.max(...arr, 1); }
  getBarH(val: number, arr: number[]): number { return Math.round((val / this.getMaxStat(arr)) * 60); }

  openDeleteConfirm(user: User) { this.selectedUser = user; this.showDeleteConfirm = true; }

  confirmDelete() {
    if (!this.selectedUser) return;
    this.userService.delete(this.selectedUser.idUser).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.idUser !== this.selectedUser?.idUser);
        this.showDeleteConfirm = false;
        this.selectedUser = null;
      },
      error: () => { alert('שגיאה במחיקת משתמש'); this.showDeleteConfirm = false; }
    });
  }

  saveUser() {
    if (!this.newUser.idUser || !this.newUser.firstName || !this.newUser.lastName || !this.newUser.email) {
      alert('נא למלא ת.ז, שם, ואימייל'); return;
    }
    this.userService.add(this.newUser as User).subscribe({
      next: () => {
        this.users.push({ ...this.newUser } as User);
        this.showAddUserModal = false;
        this.newUser = { idUser: '', firstName: '', lastName: '', phone: '', email: '' };
      },
      error: (err) => {
        if (err.status === 409 || err.status === 500) {
          alert('משתמש עם ת.ז או אימייל זה כבר קיים');
        } else {
          alert('שגיאה בהוספת משתמש (קוד: ' + err.status + ')');
        }
      }
    });
  }

  exportUsersCSV() {
    const headers = ['ת.ז', 'שם פרטי', 'שם משפחה', 'טלפון', 'יתרה'];
    const rows = this.users.map(u => [u.idUser, u.firstName, u.lastName, u.phone, this.getUserBalance(u.idUser)]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'users.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  private mockUsers: User[] = [
    { idUser: '123456789', firstName: 'ישראל', lastName: 'ישראלי', phone: '050-1234567' },
    { idUser: '987654321', firstName: 'שרה', lastName: 'כהן', phone: '052-7654321' },
    { idUser: '111222333', firstName: 'דוד', lastName: 'לוי', phone: '054-1112223' },
    { idUser: '444555666', firstName: 'מירה', lastName: 'אברהם', phone: '053-4445556' },
    { idUser: '777888999', firstName: 'יוסי', lastName: 'בן-דוד', phone: '058-7778889' },
  ];

  private mockAccounts: Account[] = [
    { idAccount: 1, password: '***', balance: 25400, user: { idUser: '123456789', firstName: 'ישראל', lastName: 'ישראלי', phone: '050-1234567' }, type: 'PRIVATE', rool: 'ADMIN' },
    { idAccount: 2, password: '***', balance: 8750, user: { idUser: '987654321', firstName: 'שרה', lastName: 'כהן', phone: '052-7654321' }, type: 'PRIVATE', rool: 'USER' },
    { idAccount: 3, password: '***', balance: 142000, user: { idUser: '111222333', firstName: 'דוד', lastName: 'לוי', phone: '054-1112223' }, type: 'BUSINESS', rool: 'USER' },
    { idAccount: 4, password: '***', balance: 3200, user: { idUser: '444555666', firstName: 'מירה', lastName: 'אברהם', phone: '053-4445556' }, type: 'PRIVATE', rool: 'USER' },
    { idAccount: 5, password: '***', balance: 67500, user: { idUser: '777888999', firstName: 'יוסי', lastName: 'בן-דוד', phone: '058-7778889' }, type: 'BUSINESS', rool: 'USER' },
  ];

  private mockTransferences: Transference[] = [
    { idTransference: 1, amount: 5000, date: new Date().toISOString(), fromAccount: this.mockAccounts[0], toAccount: this.mockAccounts[1] },
    { idTransference: 2, amount: 15000, date: new Date(Date.now() - 86400000).toISOString(), fromAccount: this.mockAccounts[2], toAccount: this.mockAccounts[0] },
    { idTransference: 3, amount: 800, date: new Date(Date.now() - 86400000 * 2).toISOString(), fromAccount: this.mockAccounts[1], toAccount: this.mockAccounts[3] },
    { idTransference: 4, amount: 25000, date: new Date(Date.now() - 86400000 * 3).toISOString(), fromAccount: this.mockAccounts[4], toAccount: this.mockAccounts[2] },
    { idTransference: 5, amount: 1200, date: new Date(Date.now() - 86400000 * 4).toISOString(), fromAccount: this.mockAccounts[3], toAccount: this.mockAccounts[4] },
  ];
}
