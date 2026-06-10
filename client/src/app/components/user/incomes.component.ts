import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeService } from '../../services/income.service';
import { AuthService } from '../../services/auth.service';
import { Income } from '../../models/models';

@Component({
  selector: 'app-incomes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in" style="direction:rtl">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 class="text-xl font-bold" style="color:#0F172A">הכנסות</h2>
          <p class="text-xs mt-1" style="color:#94A3B8">סה"כ: ₪{{ total | number:'1.0-0' }}</p>
        </div>
        <div class="flex gap-2">
          <input type="text" class="input-field w-40 text-sm" placeholder="🔍 חיפוש..." [(ngModel)]="search"/>
          <button class="btn-success text-sm" (click)="openAdd()">+ הכנסה חדשה</button>
        </div>
      </div>
      <div class="card" *ngIf="!loading">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom:2px solid #F1F5F9">
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">#</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">מקור</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">תיאור</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">תאריך</th>
              <th class="text-left pb-3 text-xs font-semibold" style="color:#94A3B8">סכום</th>
              <!-- <th class="text-left pb-3 text-xs font-semibold" style="color:#94A3B8">פעולות</th> -->
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let inc of filtered" class="table-row">
              <td class="py-3 text-xs" style="color:#94A3B8">#{{ inc.idIncome }}</td>
              <td class="py-3"><span class="badge-success">{{ inc.source }}</span></td>
              <td class="py-3 text-sm font-medium" style="color:#334155">{{ inc.description || '—' }}</td>
              <td class="py-3 text-xs" style="color:#94A3B8">{{ inc.incomeDate | date:'dd/MM/yyyy' }}</td>
              <td class="py-3 text-left font-bold" style="color:#059669">+₪{{ inc.amount | number:'1.0-0' }}</td>
              <!-- <td class="py-3 text-left">
                <div class="flex gap-2 justify-end">
                  <button class="btn-ghost" style="padding:4px 10px;font-size:.78rem" (click)="openEdit(inc)">עריכה</button>
                  <button class="btn-danger" style="padding:4px 10px;font-size:.78rem" (click)="deleteIncome(inc)">מחיקה</button>
                </div>
              </td> -->
            </tr>
            <tr *ngIf="filtered.length === 0">
              <td colspan="6" class="py-10 text-center text-sm" style="color:#94A3B8">אין הכנסות</td>
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
          <h2 class="text-lg font-bold" style="color:#0F172A">{{ editMode ? 'עריכת הכנסה' : 'הכנסה חדשה' }}</h2>
          <button class="p-1.5 rounded-lg hover:bg-slate-100" style="color:#64748B" (click)="showModal = false">✕</button>
        </div>
        <div class="flex flex-col gap-4">
          <div><label class="block text-sm font-semibold mb-2" style="color:#334155">סכום (₪)</label><input type="number" class="input-field" [(ngModel)]="form.amount"/></div>
          <div><label class="block text-sm font-semibold mb-2" style="color:#334155">מקור</label><input type="text" class="input-field" placeholder="משכורת, פרילנס..." [(ngModel)]="form.source"/></div>
          <div><label class="block text-sm font-semibold mb-2" style="color:#334155">תיאור</label><input type="text" class="input-field" [(ngModel)]="form.description"/></div>
          <div *ngIf="formError" class="text-sm" style="color:#EF4444">{{ formError }}</div>
          <div class="flex gap-3 mt-2">
            <button class="btn-ghost flex-1" (click)="showModal = false">ביטול</button>
            <button class="btn-success flex-1" (click)="save()" [disabled]="saving">{{ saving ? 'שומר...' : 'שמור' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class IncomesComponent implements OnInit {
  pageTitle = 'הכנסות';
  private incomeService = inject(IncomeService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  incomes: Income[] = [];
  loading = true;
  saving = false;
  search = '';
  showModal = false;
  editMode = false;
  editId: number | null = null;
  form: { amount: number | null, source: string, description: string } = { amount: null, source: '', description: '' };
  formError = '';
  errorMsg = '';
  successMsg = '';

  ngOnInit() {
    this.loadIncomes();
  }

  loadIncomes() {
    this.loading = true;
    this.incomeService.getAll().subscribe({
      next: (data: Income[]) => {
        const uid = this.authService.currentAccount()?.user.idUser;
        this.incomes = data.filter((i: Income) => i.owner?.idUser === uid);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openAdd() {
    this.editMode = false;
    this.editId = null;
    this.form = { amount: null, source: '', description: '' };
    this.formError = '';
    this.showModal = true;
  }

  openEdit(inc: Income) {
    this.editMode = true;
    this.editId = inc.idIncome ?? null;
    this.form = { amount: inc.amount, source: inc.source, description: inc.description };
    this.formError = '';
    this.showModal = true;
  }

  save() {
    if (!this.form.amount || this.form.amount <= 0 || !this.form.source) {
      this.formError = 'סכום ומקור הם שדות חובה';
      return;
    }
    const user = this.authService.currentAccount()?.user;
    if (!user) return;

    const payload: Income = {
      ...(this.editMode && this.editId ? { idIncome: this.editId } : {}),
      amount: this.form.amount,
      source: this.form.source,
      description: this.form.description,
      incomeDate: new Date().toISOString(),
      owner: user,
    };

    this.saving = true;
    const call = this.editMode && this.editId
      ? this.incomeService.update(payload)
      : this.incomeService.add(payload);

    call.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.showSuccess(this.editMode ? 'ההכנסה עודכנה בהצלחה' : 'ההכנסה נוספה בהצלחה');
        this.loadIncomes();
        this.cdr.detectChanges();
      },
      error: () => {
        this.saving = false;
        this.formError = 'שגיאה בשמירה, נסה שנית';
      }
    });
  }

  deleteIncome(inc: Income) {
    if (!inc.idIncome || !confirm(`למחוק הכנסה של ₪${inc.amount}?`)) return;
    this.incomeService.delete(inc.idIncome).subscribe({
      next: () => {
        this.incomes = this.incomes.filter(i => i.idIncome !== inc.idIncome);
        this.showSuccess('ההכנסה נמחקה');
      },
      error: () => { this.errorMsg = 'שגיאה במחיקה'; setTimeout(() => this.errorMsg = '', 3000); }
    });
  }

  get filtered(): Income[] {
    if (!this.search) return this.incomes;
    const q = this.search.toLowerCase();
    return this.incomes.filter((i: Income) => i.source?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q));
  }

  get total(): number { return this.incomes.reduce((s, i) => s + i.amount, 0); }

  private showSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => this.successMsg = '', 3000);
  }
}
