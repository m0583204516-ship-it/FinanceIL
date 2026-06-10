import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { IncomeService } from '../../services/income.service';
import { ExpenseService } from '../../services/expense.service';
import { TransferenceService } from '../../services/transference.service';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Income, Expense, Transference, Account } from '../../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styles: `
    .action-btns button {
      padding: 4px 10px;
      font-size: .78rem;
    }
    .btn-ghost {
      background: transparent;
      color: #334155;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }
    .btn-ghost:hover {
      background: #f8fafc;
    }
    .btn-danger {
      background: #dc2626;
      color: white;
      border: none;
      border-radius: 4px;
    }
    .btn-danger:hover {
      background: #b91c1c;
    } 
  `,
})
export class UserDashboardComponent implements OnInit {
  pageTitle = 'לוח בקרה';

  private incomeService = inject(IncomeService);
  private expenseService = inject(ExpenseService);
  private transferenceService = inject(TransferenceService);
  private accountService = inject(AccountService);
  authService = inject(AuthService);
  private router = inject(Router);

  incomes: Income[] = [];
  expenses: Expense[] = [];
  transferences: Transference[] = [];
  loading = true;

  showTransferModal = false;
  showIncomeModal = false;
  showExpenseModal = false;

  transferStep = 1;
  transferData = { toAccountId: 0, amount: 0, note: '' };
  transferSuccess = false;
  transferError = '';
  transferSaving = false;
  transferToAccount: Account | null = null;

  newIncome = { amount: 0, source: '', description: '' };
  newExpense = { amount: 0, category: '', description: '', isFutureExpense: false };

  categoryIcons: Record<string, string> = {
    'מזון': '🍔', 'שכירות': '🏠', 'חשמל/גז/מים': '💡',
    'בידור': '🎬', 'תחבורה': '🚗', 'בריאות': '🏥',
    'קניות': '🛍️', 'חינוך': '📚', 'אחר': '📦',
  };

  expenseCategories = Object.keys(this.categoryIcons);

  budgetLimits: Record<string, number> = {
    'מזון': 2000, 'שכירות': 4000, 'חשמל/גז/מים': 800,
    'בידור': 500, 'תחבורה': 1200, 'בריאות': 600,
    'קניות': 1500, 'חינוך': 1000, 'אחר': 500,
  };

  savingsGoals = [
    { name: 'רכב חדש', icon: '🚗', target: 80000, saved: 35000 },
    { name: 'חופשה', icon: '✈️', target: 15000, saved: 9500 },
    { name: 'קרן חירום', icon: '🛡️', target: 30000, saved: 30000 },
  ];

  ngOnInit() {
    this.loading = true;
    Promise.all([
      firstValueFrom(this.incomeService.getAll()),
      firstValueFrom(this.expenseService.getAll()),
      firstValueFrom(this.transferenceService.getAll()),
    ]).then(([incomes, expenses, transferences]) => {
      const userId = this.authService.currentAccount()?.user.idUser;
      this.incomes = (incomes || []).filter((i: any) => i.owner?.idUser === userId);
      this.expenses = (expenses || []).filter((e: any) => e.owner?.idUser === userId && !e.isCanceled);
      this.transferences = transferences || [];
      this.loading = false;
    }).catch(() => {
      this.incomes = this.mockIncomes;
      this.expenses = this.mockExpenses;
      this.transferences = [];
      this.loading = false;
    });
  }

  get totalBalance(): number { return this.authService.currentAccount()?.balance ?? 0; }

  get monthlyIncome(): number {
    const now = new Date();
    return this.incomes.filter(i => new Date(i.incomeDate).getMonth() === now.getMonth()).reduce((s, i) => s + i.amount, 0);
  }

  get monthlyExpenses(): number {
    const now = new Date();
    return this.expenses.filter(e => new Date(e.expenseDate).getMonth() === now.getMonth()).reduce((s, e) => s + e.amount, 0);
  }

  get recentTransactions(): any[] {
    const all: any[] = [
      ...this.incomes.map(i => ({ ...i, type: 'income', date: i.incomeDate, label: i.source })),
      ...this.expenses.map(e => ({ ...e, type: 'expense', date: e.expenseDate, label: e.category })),
    ];
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
  }

  get categoryBreakdown(): { name: string; amount: number; percent: number; color: string }[] {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    const map: Record<string, number> = {};
    this.expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(map).map(([name, amount], i) => ({
      name, amount,
      percent: Math.round((amount / total) * 100),
      color: colors[i % colors.length],
    }));
  }

  get budgetProgress(): { category: string; spent: number; limit: number; percent: number; color: string }[] {
    const map: Record<string, number> = {};
    const now = new Date();
    this.expenses.filter(e => new Date(e.expenseDate).getMonth() === now.getMonth())
      .forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.keys(this.budgetLimits).map(cat => {
      const spent = map[cat] || 0;
      const limit = this.budgetLimits[cat];
      const percent = Math.min(Math.round((spent / limit) * 100), 100);
      const color = percent >= 90 ? '#ef4444' : percent >= 70 ? '#f59e0b' : '#10b981';
      return { category: cat, spent, limit, percent, color };
    }).filter(b => b.spent > 0);
  }

  get last6MonthsData(): { month: string; income: number; expenses: number }[] {
    const hebrewMonths = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
      const m = d.getMonth(); const y = d.getFullYear();
      return {
        month: hebrewMonths[m],
        income: this.incomes.filter(inc => { const dt = new Date(inc.incomeDate); return dt.getMonth() === m && dt.getFullYear() === y; }).reduce((s, inc) => s + inc.amount, 0),
        expenses: this.expenses.filter(exp => { const dt = new Date(exp.expenseDate); return dt.getMonth() === m && dt.getFullYear() === y; }).reduce((s, exp) => s + exp.amount, 0),
      };
    });
  }

  get maxChartValue(): number { return Math.max(...this.last6MonthsData.flatMap(d => [d.income, d.expenses]), 1); }

  getBarHeight(value: number): number { return Math.round((value / this.maxChartValue) * 120); }

  getDonutOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) offset += this.categoryBreakdown[i].percent * 2.199;
    return -offset;
  }

  getSavingsPercent(goal: { target: number; saved: number }): number { return Math.min(Math.round((goal.saved / goal.target) * 100), 100); }

  getSavingsColor(percent: number): string {
    if (percent >= 100) return '#10b981';
    if (percent >= 60) return '#3b82f6';
    return '#f59e0b';
  }

  submitTransfer() {
    this.transferError = '';
    if (this.transferStep === 1) {
      if (!this.transferData.toAccountId) return;
      this.transferSaving = true;
      this.accountService.getById(this.transferData.toAccountId).subscribe({
        next: (acc) => {
          this.transferSaving = false;
          if (acc.idAccount === this.authService.currentAccount()?.idAccount) {
            this.transferError = 'לא ניתן להעביר לאותו חשבון';
            return;
          }
          this.transferToAccount = acc;
          this.transferStep = 2;
        },
        error: () => { this.transferSaving = false; this.transferError = 'חשבון לא נמצא'; }
      });
    } else if (this.transferStep === 2) {
      if (!this.transferData.amount || this.transferData.amount <= 0) { this.transferError = 'סכום לא תקין'; return; }
      const balance = this.authService.currentAccount()?.balance ?? 0;
      if (this.transferData.amount > balance) { this.transferError = 'אין מספיק יתרה'; return; }
      this.transferStep = 3;
    } else if (this.transferStep === 3) {
      const fromAccount = this.authService.currentAccount();
      if (!fromAccount || !this.transferToAccount) return;
      const payload: Transference = {
        amount: this.transferData.amount,
        date: new Date().toISOString(),
        fromAccount,
        toAccount: this.transferToAccount,
      };
      this.transferSaving = true;
      this.transferenceService.add(payload).subscribe({
        next: () => { this.transferSaving = false; this.transferSuccess = true; this.refreshBalance(); this.ngOnInit(); },
        error: () => { this.transferSaving = false; this.transferError = 'שגיאה בביצוע ההעברה'; }
      });
    }
  }

  closeTransferModal() {
    this.showTransferModal = false;
    this.transferStep = 1;
    this.transferData = { toAccountId: 0, amount: 0, note: '' };
    this.transferSuccess = false;
    this.transferError = '';
    this.transferToAccount = null;
  }

  private refreshBalance() {
    const acc = this.authService.currentAccount();
    if (!acc?.idAccount) return;
    this.accountService.getById(acc.idAccount).subscribe({
      next: (updated) => this.authService.updateBalance(updated.balance),
      error: () => {}
    });
  }

  submitIncome() {
    if (!this.newIncome.amount || !this.newIncome.source) return;
    const user = this.authService.currentAccount()?.user;
    if (!user) return;
    const payload = {
      amount: this.newIncome.amount,
      source: this.newIncome.source,
      description: this.newIncome.description,
      incomeDate: new Date().toISOString(),
      owner: user,
    };
    this.incomeService.add(payload as any).subscribe({
      next: () => {
        this.showIncomeModal = false;
        const cur = this.authService.currentAccount()?.balance ?? 0;
        this.authService.updateBalance(cur + this.newIncome.amount);
        this.newIncome = { amount: 0, source: '', description: '' };
        this.refreshBalance();
        this.ngOnInit();
      },
      error: () => alert('שגיאה בהוספת הכנסה')
    });
  }

  submitExpense() {
    if (!this.newExpense.amount || !this.newExpense.category) return;
    const user = this.authService.currentAccount()?.user;
    if (!user) return;
    const payload = {
      amount: this.newExpense.amount,
      category: this.newExpense.category,
      description: this.newExpense.description,
      expenseDate: new Date().toISOString(),
      isCanceled: false,
      isFutureExpense: this.newExpense.isFutureExpense,
      owner: user,
    };
    this.expenseService.add(payload as any).subscribe({
      next: () => {
        this.showExpenseModal = false;
        const cur = this.authService.currentAccount()?.balance ?? 0;
        this.authService.updateBalance(cur - this.newExpense.amount);
        this.newExpense = { amount: 0, category: '', description: '', isFutureExpense: false };
        this.refreshBalance();
        this.ngOnInit();
      },
      error: () => alert('שגיאה בהוספת הוצאה')
    });
  }

  exportCSV() { this.router.navigate(['/transactions']); }

  private mockIncomes: Income[] = [
    { idIncome: 1, amount: 12000, source: 'משכורת', description: 'משכורת חודשית', incomeDate: new Date().toISOString(), owner: {} as any },
    { idIncome: 2, amount: 2500, source: 'פרילנס', description: 'פרויקט web', incomeDate: new Date(Date.now() - 86400000 * 5).toISOString(), owner: {} as any },
    { idIncome: 3, amount: 11800, source: 'משכורת', description: 'משכורת חודשית', incomeDate: new Date(Date.now() - 86400000 * 35).toISOString(), owner: {} as any },
    { idIncome: 4, amount: 11800, source: 'משכורת', description: 'משכורת חודשית', incomeDate: new Date(Date.now() - 86400000 * 65).toISOString(), owner: {} as any },
  ];

  private mockExpenses: Expense[] = [
    { idExpense: 1, amount: 3800, category: 'שכירות', description: 'דמי שכירות', expenseDate: new Date().toISOString(), isCanceled: false, isFutureExpense: false, owner: {} as any },
    { idExpense: 2, amount: 850, category: 'מזון', description: 'סופרמרקט', expenseDate: new Date(Date.now() - 86400000 * 2).toISOString(), isCanceled: false, isFutureExpense: false, owner: {} as any },
    { idExpense: 3, amount: 450, category: 'בידור', description: 'מסעדות', expenseDate: new Date(Date.now() - 86400000 * 4).toISOString(), isCanceled: false, isFutureExpense: false, owner: {} as any },
    { idExpense: 4, amount: 320, category: 'חשמל/גז/מים', description: 'חשבון חשמל', expenseDate: new Date(Date.now() - 86400000 * 7).toISOString(), isCanceled: false, isFutureExpense: false, owner: {} as any },
    { idExpense: 5, amount: 650, category: 'תחבורה', description: 'דלק + חניה', expenseDate: new Date(Date.now() - 86400000 * 10).toISOString(), isCanceled: false, isFutureExpense: false, owner: {} as any },
    { idExpense: 6, amount: 3800, category: 'שכירות', description: 'דמי שכירות', expenseDate: new Date(Date.now() - 86400000 * 35).toISOString(), isCanceled: false, isFutureExpense: false, owner: {} as any },
    { idExpense: 7, amount: 900, category: 'מזון', description: 'סופרמרקט', expenseDate: new Date(Date.now() - 86400000 * 40).toISOString(), isCanceled: false, isFutureExpense: false, owner: {} as any },
    { idExpense: 8, amount: 200, category: 'בריאות', description: 'תרופות', expenseDate: new Date(Date.now() - 86400000 * 45).toISOString(), isCanceled: false, isFutureExpense: false, owner: {} as any },
  ];
}
