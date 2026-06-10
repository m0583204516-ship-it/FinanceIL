import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeService } from '../../services/income.service';
import { ExpenseService } from '../../services/expense.service';
import { TransferenceService } from '../../services/transference.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in" style="direction:rtl">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 class="text-xl font-bold" style="color:#0F172A">היסטוריית עסקאות</h2>
          <p class="text-xs mt-1" style="color:#94A3B8">{{ filtered.length }} עסקאות</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <select class="input-field w-36 text-sm" [(ngModel)]="filterType">
            <option value="">הכל</option>
            <option value="income">הכנסות</option>
            <option value="expense">הוצאות</option>
            <option value="transfer">העברות</option>
          </select>
          <button class="btn-ghost text-sm" (click)="exportCSV()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            ייצוא CSV
          </button>
        </div>
      </div>
      <div class="card" *ngIf="!loading">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom:2px solid #F1F5F9">
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">סוג</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">פרטים</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">קטגוריה/מקור</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">תאריך</th>
              <th class="text-left pb-3 text-xs font-semibold" style="color:#94A3B8">סכום</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tx of paginated" class="table-row">
              <td class="py-3">
                <span [class]="tx.type === 'income' ? 'badge-success' : tx.type === 'expense' ? 'badge-danger' : 'badge-info'">
                  {{ tx.type === 'income' ? 'הכנסה' : tx.type === 'expense' ? 'הוצאה' : 'העברה' }}
                </span>
              </td>
              <td class="py-3 text-sm font-medium" style="color:#334155">{{ tx.description || '—' }}</td>
              <td class="py-3 text-xs" style="color:#64748B">{{ tx.label || '—' }}</td>
              <td class="py-3 text-xs" style="color:#94A3B8">{{ tx.date | date:'dd/MM/yyyy' }}</td>
              <td class="py-3 text-left font-bold"
                  [style.color]="tx.type === 'income' ? '#059669' : '#DC2626'">
                {{ tx.type === 'income' ? '+' : '-' }}₪{{ tx.amount | number:'1.0-0' }}
              </td>
            </tr>
            <tr *ngIf="paginated.length === 0">
              <td colspan="5" class="py-10 text-center text-sm" style="color:#94A3B8">אין עסקאות</td>
            </tr>
          </tbody>
        </table>
        <div class="flex items-center justify-between mt-4 pt-4 border-t" style="border-color:#F1F5F9" *ngIf="totalPages > 1">
          <span class="text-xs" style="color:#94A3B8">עמוד {{ page }} מתוך {{ totalPages }}</span>
          <div class="flex gap-2">
            <button class="btn-ghost py-1 px-3 text-xs" (click)="page = page - 1" [disabled]="page === 1">הקודם</button>
            <button class="btn-ghost py-1 px-3 text-xs" (click)="page = page + 1" [disabled]="page === totalPages">הבא</button>
          </div>
        </div>
      </div>
      <div class="skeleton h-64 rounded-2xl" *ngIf="loading"></div>
    </div>
  `,
})
export class TransactionsComponent implements OnInit {
  pageTitle = 'היסטוריית עסקאות';
  private incomeService = inject(IncomeService);
  private expenseService = inject(ExpenseService);
  private transferenceService = inject(TransferenceService);
  private authService = inject(AuthService);

  allTransactions: any[] = [];
  loading = true;
  filterType = '';
  page = 1;
  pageSize = 15;

  ngOnInit() {
    const uid = this.authService.currentAccount()?.user.idUser;
    const accId = this.authService.currentAccount()?.idAccount;
    Promise.all([
      this.incomeService.getAll().toPromise(),
      this.expenseService.getAll().toPromise(),
      this.transferenceService.getAll().toPromise(),
    ]).then(([incomes, expenses, transfers]) => {
      const inc = (incomes || []).filter((i: any) => i.owner?.idUser === uid).map((i: any) => ({ ...i, type: 'income', date: i.incomeDate, label: i.source }));
      const exp = (expenses || []).filter((e: any) => e.owner?.idUser === uid).map((e: any) => ({ ...e, type: 'expense', date: e.expenseDate, label: e.category }));
      const tra = (transfers || []).filter((t: any) => t.fromAccount?.idAccount === accId || t.toAccount?.idAccount === accId).map((t: any) => ({ ...t, type: 'transfer', label: 'העברה' }));
      this.allTransactions = [...inc, ...exp, ...tra].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.loading = false;
    }).catch(() => { this.loading = false; });
  }

  get filtered(): any[] {
    if (!this.filterType) return this.allTransactions;
    return this.allTransactions.filter(t => t.type === this.filterType);
  }

  get paginated(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.pageSize);
  }

  exportCSV() {
    const headers = ['סוג', 'פרטים', 'קטגוריה', 'תאריך', 'סכום'];
    const rows = this.filtered.map((t: any) => [
      t.type === 'income' ? 'הכנסה' : t.type === 'expense' ? 'הוצאה' : 'העברה',
      t.description || '',
      t.label || '',
      new Date(t.date).toLocaleDateString('he-IL'),
      (t.type === 'income' ? '+' : '-') + t.amount,
    ]);
    const csv = [headers, ...rows].map((r: any[]) => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
