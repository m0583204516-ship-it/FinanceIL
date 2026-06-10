import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { Expense } from '../../models/models';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in" style="direction:rtl">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 class="text-xl font-bold" style="color:#0F172A">הוצאות</h2>
          <p class="text-xs mt-1" style="color:#94A3B8">סה"כ: ₪{{ total | number:'1.0-0' }}</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <input type="text" class="input-field w-40 text-sm" placeholder="🔍 חיפוש..." [(ngModel)]="search"/>
          <select class="input-field w-36 text-sm" [(ngModel)]="filterCategory">
            <option value="">כל הקטגוריות</option>
            <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
          </select>
          <button class="btn-danger text-sm" (click)="openAdd()">+ הוצאה חדשה</button>
        </div>
      </div>

      <div class="card" *ngIf="!loading">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom:2px solid #F1F5F9">
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">#</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">קטגוריה</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">תיאור</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">תאריך</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">סטטוס</th>
              <th class="text-left pb-3 text-xs font-semibold" style="color:#94A3B8">סכום</th>
              <!-- <th class="text-left pb-3 text-xs font-semibold" style="color:#94A3B8">פעולות</th> -->
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let exp of filtered" class="table-row">
              <td class="py-3 text-xs" style="color:#94A3B8">#{{ exp.idExpense }}</td>
              <td class="py-3"><span class="badge-danger">{{ exp.category }}</span></td>
              <td class="py-3 text-sm font-medium" style="color:#334155">{{ exp.description || '—' }}</td>
              <td class="py-3 text-xs" style="color:#94A3B8">{{ exp.expenseDate | date:'dd/MM/yyyy' }}</td>
              <td class="py-3">
                <span *ngIf="exp.isCanceled" class="badge-warning">בוטל</span>
                <span *ngIf="exp.isFutureExpense && !exp.isCanceled" class="badge-info">עתידי</span>
                <span *ngIf="!exp.isCanceled && !exp.isFutureExpense" class="badge-success">שולם</span>
              </td>
              <td class="py-3 text-left font-bold" style="color:#DC2626">-₪{{ exp.amount | number:'1.0-0' }}</td>
              <!-- <td class="py-3 text-left">
                <div class="flex gap-2 justify-end">
                  <button class="btn-ghost" style="padding:4px 10px;font-size:.78rem" (click)="openEdit(exp)">עריכה</button>
                  <button class="btn-danger" style="padding:4px 10px;font-size:.78rem" (click)="deleteExpense(exp)">מחיקה</button>
                </div>
              </td> -->
            </tr>
            <tr *ngIf="filtered.length === 0">
              <td colspan="7" class="py-10 text-center text-sm" style="color:#94A3B8">אין הוצאות</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="skeleton h-64 rounded-2xl" *ngIf="loading"></div>

      <div *ngIf="errorMsg" class="mt-3 p-3 rounded-xl text-sm" style="background:#FEF2F2;border:1px solid #FECACA;color:#DC2626">{{ errorMsg }}</div>
      <div *ngIf="successMsg" class="mt-3 p-3 rounded-xl text-sm" style="background:#ECFDF5;border:1px solid #A7F3D0;color:#059669">{{ successMsg }}</div>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="$event.target === $event.currentTarget && (showModal = false)">
      <div class="modal-box" style="direction:rtl">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold" style="color:#0F172A">{{ editMode ? 'עריכת הוצאה' : 'הוצאה חדשה' }}</h2>
          <button class="p-1.5 rounded-lg hover:bg-slate-100" style="color:#64748B" (click)="showModal = false">✕</button>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2" style="color:#334155">סכום (₪)</label>
            <input type="number" class="input-field" placeholder="הכנס סכום" [(ngModel)]="form.amount"/>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2" style="color:#334155">קטגוריה</label>
            <select class="input-field" [(ngModel)]="form.category">
              <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2" style="color:#334155">תיאור</label>
            <input type="text" class="input-field" placeholder="תיאור הוצאה..." [(ngModel)]="form.description"/>
          </div>
          <div class="flex items-center gap-2" style="padding:10px 14px;background:var(--gray-50);border-radius:var(--radius);border:1px solid var(--gray-200)">
            <input type="checkbox" id="futureExp" [(ngModel)]="form.isFutureExpense" style="width:16px;height:16px;accent-color:var(--red)"/>
            <label for="futureExp" class="text-sm font-semibold" style="color:#334155;cursor:pointer">הוצאה עתידית</label>
          </div>
          <div *ngIf="formError" class="text-sm" style="color:#EF4444;background:#FEF2F2;padding:8px 12px;border-radius:8px;border:1px solid #FECACA">{{ formError }}</div>
          <div class="flex gap-3 mt-1">
            <button class="btn-ghost flex-1" (click)="showModal = false">ביטול</button>
            <button class="btn-danger flex-1" (click)="save()" [disabled]="saving">{{ saving ? 'שומר...' : 'שמור' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ExpensesComponent implements OnInit {
  pageTitle = 'הוצאות';
  private expenseService = inject(ExpenseService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  expenses: Expense[] = [];
  loading = true;
  saving = false;
  search = '';
  filterCategory = '';
  showModal = false;
  editMode = false;
  editId: number | null = null;
  form: { amount: number | null, category: string, description: string, isFutureExpense: boolean } = { amount: null, category: 'מזון', description: '', isFutureExpense: false };
  formError = '';
  errorMsg = '';
  successMsg = '';
  categories = ['מזון', 'שכירות', 'חשמל/גז/מים', 'בידור', 'תחבורה', 'בריאות', 'קניות', 'חינוך', 'אחר'];

  ngOnInit() { this.loadExpenses(); }

  loadExpenses() {
    this.loading = true;
    this.expenseService.getAll().subscribe({
      next: (data: Expense[]) => {
        console.log('expenses from server:', data);
        const uid = this.authService.currentAccount()?.user.idUser;
        console.log('current uid:', uid);
        this.expenses = data.filter((e: Expense) => e.owner?.idUser === uid);
        console.log('filtered expenses:', this.expenses);
        this.loading = false;
      },
      error: (err) => { console.error('expenses error:', err); this.loading = false; }
    });
  }

  openAdd() {
    this.editMode = false;
    this.editId = null;
    this.form = { amount: null, category: 'מזון', description: '', isFutureExpense: false };
    this.formError = '';
    this.showModal = true;
  }

  openEdit(exp: Expense) {
    this.editMode = true;
    this.editId = exp.idExpense ?? null;
    this.form = { amount: exp.amount, category: exp.category, description: exp.description, isFutureExpense: exp.isFutureExpense };
    this.formError = '';
    this.showModal = true;
  }

  save() {
    if (!this.form.amount || this.form.amount <= 0 || !this.form.category) {
      this.formError = 'סכום וקטגוריה הם שדות חובה';
      return;
    }
    const user = this.authService.currentAccount()?.user;
    if (!user) return;

    const payload: Expense = {
      ...(this.editMode && this.editId ? { idExpense: this.editId } : {}),
      amount: this.form.amount,
      category: this.form.category,
      description: this.form.description,
      expenseDate: new Date().toISOString(),
      isCanceled: false,
      isFutureExpense: this.form.isFutureExpense,
      owner: user,
    };

    this.saving = true;
    const call = this.editMode && this.editId
      ? this.expenseService.update(payload)
      : this.expenseService.add(payload);

    call.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.showSuccess(this.editMode ? 'ההוצאה עודכנה בהצלחה' : 'ההוצאה נוספה בהצלחה');
        this.loadExpenses();
        this.cdr.detectChanges();
      },
      error: () => { this.saving = false; this.formError = 'שגיאה בשמירה, נסה שנית'; }
    });
  }

  cancelExpense(exp: Expense) {
    if (!exp.idExpense) return;
    const updated: Expense = { ...exp, isCanceled: true };
    this.expenseService.update(updated).subscribe({
      next: () => {
        exp.isCanceled = true;
        this.showSuccess('ההוצאה בוטלה');
      },
      error: () => { this.errorMsg = 'שגיאה בביטול'; setTimeout(() => this.errorMsg = '', 3000); }
    });
  }

  deleteExpense(exp: Expense) {
    if (!exp.idExpense || !confirm(`למחוק הוצאה של ₪${exp.amount}?`)) return;
    this.expenseService.delete(exp.idExpense).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(e => e.idExpense !== exp.idExpense);
        this.showSuccess('ההוצאה נמחקה');
      },
      error: () => { this.errorMsg = 'שגיאה במחיקה'; setTimeout(() => this.errorMsg = '', 3000); }
    });
  }

  get filtered(): Expense[] {
    return this.expenses.filter((e: Expense) => {
      const matchSearch = !this.search || e.description?.toLowerCase().includes(this.search.toLowerCase()) || e.category?.toLowerCase().includes(this.search.toLowerCase());
      const matchCat = !this.filterCategory || e.category === this.filterCategory;
      return matchSearch && matchCat;
    });
  }

  get total(): number { return this.expenses.filter(e => !e.isCanceled).reduce((s, e) => s + e.amount, 0); }

  private showSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => this.successMsg = '', 3000);
  }
}
