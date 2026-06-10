import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepositService } from '../../services/deposit.service';
import { AuthService } from '../../services/auth.service';
import { Deposit } from '../../models/models';

@Component({
  selector: 'app-deposits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in" style="direction:rtl">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 class="text-xl font-bold" style="color:#0F172A">פיקדונות</h2>
          <p class="text-xs mt-1" style="color:#94A3B8">סה"כ: ₪{{ total | number:'1.0-0' }}</p>
        </div>
        <button class="btn-primary text-sm" (click)="openAdd()">+ פיקדון חדש</button>
        
      </div>
 <span class="text-xs" style="color:#94A3B8;font-style:italic">ריבית שנתית: 2.5%</span>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px" *ngIf="!loading">
        <div *ngFor="let dep of deposits" class="card" style="display:flex;flex-direction:column;gap:12px">
          <div class="flex items-center justify-between">
            <div style="font-size:1.8rem">🏦</div>
            <span [class]="dep.isReleased ? 'badge-success' : 'badge-info'">
              {{ dep.isReleased ? 'שוחרר' : 'פעיל' }}
            </span>
          </div>
          <p class="font-extrabold" style="font-size:1.6rem;color:#0F172A">₪{{ dep.amount | number:'1.0-0' }}</p>
          <p class="text-xs font-semibold" style="color:#64748B">{{ dep.depositType }}</p>
          <div class="flex flex-col gap-1" style="border-top:1px solid var(--gray-200);padding-top:10px">
            <div class="flex justify-between text-xs" style="color:#94A3B8">
              <span>תחילה:</span>
              <span class="font-semibold" style="color:#334155">{{ dep.startDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="flex justify-between text-xs" style="color:#94A3B8">
              <span>תוקף:</span>
              <span class="font-semibold" style="color:#334155">{{ dep.endDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div style="margin-top:6px;padding-top:6px;border-top:1px dashed var(--gray-200);display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center">
              <span class="text-xs" style="color:#94A3B8">ישוחרר בסוף התקופה</span>
              <span class="font-bold" style="color:var(--green);font-size:1rem">₪{{ calcRelease(dep) | number:'1.2-2' }}</span>
            </div>
          </div>
          <div style="padding:8px 12px;background:var(--gray-50);border-radius:var(--radius);border:1px solid var(--gray-200);font-size:.75rem;color:#64748B;text-align:center">
            לעדכון / מחיקת הפיקדון פנה לפקיד
          </div>
        </div>
        <div *ngIf="deposits.length === 0" class="card text-center" style="color:#94A3B8;padding:40px;grid-column:1/-1">אין פיקדונות פעילים</div>
      </div>

      <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:16px" *ngIf="loading">
        <div *ngFor="let i of [1,2,3]" class="skeleton" style="height:200px"></div>
      </div>

      <div *ngIf="errorMsg" class="mt-3 p-3 rounded-xl text-sm" style="background:#FEF2F2;border:1px solid #FECACA;color:#DC2626">{{ errorMsg }}</div>
      <div *ngIf="successMsg" class="mt-3 p-3 rounded-xl text-sm" style="background:#ECFDF5;border:1px solid #A7F3D0;color:#059669">{{ successMsg }}</div>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="$event.target === $event.currentTarget && (showModal = false)">
      <div class="modal-box" (click)="$event.stopPropagation()" style="direction:rtl;max-height:90vh;overflow-y:auto">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold" style="color:#0F172A">פיקדון חדש</h2>
          <button class="p-1.5 rounded-lg hover:bg-slate-100" style="color:#64748B" (click)="showModal = false">✕</button>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2" style="color:#334155">סכום (₪)</label>
            <input type="number" class="input-field" placeholder="הכנס סכום" [(ngModel)]="form.amount"/>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2" style="color:#334155">סוג פיקדון</label>
            <select class="input-field" [(ngModel)]="form.depositType">
              <option>קצר טווח</option>
              <option>בינוני</option>
              <option>ארוך טווח</option>
            </select>
          </div>
          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-sm font-semibold mb-2" style="color:#334155">תאריך התחלה</label>
              <input type="date" class="input-field" [(ngModel)]="form.startDate"/>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold mb-2" style="color:#334155">תאריך סיום</label>
              <input type="date" class="input-field" [(ngModel)]="form.endDate"/>
            </div>
          </div>
          <div *ngIf="formError" class="text-sm" style="color:#EF4444;background:#FEF2F2;padding:8px 12px;border-radius:8px;border:1px solid #FECACA">{{ formError }}</div>
          <div class="flex gap-3 mt-1">
            <button class="btn-ghost flex-1" (click)="showModal = false">ביטול</button>
            <button class="btn-primary flex-1" (click)="save()" [disabled]="saving">{{ saving ? 'שומר...' : 'שמור' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DepositsComponent implements OnInit {
  pageTitle = 'פיקדונות';
  private depositService = inject(DepositService);
  private authService = inject(AuthService);

  deposits: Deposit[] = [];
  loading = true;
  saving = false;
  showModal = false;
  form: { amount: number | null, depositType: string, startDate: string, endDate: string } = { amount: null, depositType: 'קצר טווח', startDate: '', endDate: '' };
  formError = '';
  errorMsg = '';
  successMsg = '';

  ngOnInit() { this.loadDeposits(); }

  loadDeposits() {
    this.loading = true;
    this.depositService.getAll().subscribe({
      next: (data: Deposit[]) => {
        const uid = this.authService.currentAccount()?.user.idUser;
        this.deposits = data.filter((d: Deposit) => d.owner?.idUser === uid);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openAdd() {
    this.form = { amount: null, depositType: 'קצר טווח', startDate: '', endDate: '' };
    this.formError = '';
    this.showModal = true;
  }

  save() {
    if (!this.form.amount || this.form.amount <= 0 || !this.form.startDate || !this.form.endDate) {
      this.formError = 'נא למלא את כל השדות';
      return;
    }
    const user = this.authService.currentAccount()?.user;
    if (!user) return;

    const payload: Deposit = {
      amount: this.form.amount,
      depositType: this.form.depositType,
      startDate: this.form.startDate,
      endDate: this.form.endDate,
      isReleased: false,
      owner: user,
    };

    this.saving = true;
    this.depositService.add(payload).subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.showSuccess('הפיקדון נוסף בהצלחה');
        this.loadDeposits();
      },
      error: () => { this.saving = false; this.formError = 'שגיאה בשמירה, נסה שנית'; }
    });
  }

  releaseDeposit(dep: Deposit) {
    if (!dep.idDeposit || !confirm('לשחרר את הפיקדון?')) return;
    const updated: Deposit = { ...dep, isReleased: true };
    this.depositService.update(updated).subscribe({
      next: () => { dep.isReleased = true; this.showSuccess('הפיקדון שוחרר'); },
      error: () => { this.errorMsg = 'שגיאה בשחרור'; setTimeout(() => this.errorMsg = '', 3000); }
    });
  }

  deleteDeposit(dep: Deposit) {
    if (!dep.idDeposit || !confirm('למחוק את הפיקדון?')) return;
    this.depositService.delete(dep.idDeposit).subscribe({
      next: () => {
        this.deposits = this.deposits.filter(d => d.idDeposit !== dep.idDeposit);
        this.showSuccess('הפיקדון נמחק');
      },
      error: () => { this.errorMsg = 'שגיאה במחיקה'; setTimeout(() => this.errorMsg = '', 3000); }
    });
  }

  get total(): number { return this.deposits.reduce((s, d) => s + d.amount, 0); }

  calcRelease(dep: Deposit): number {
    if (!dep.startDate || !dep.endDate) return dep.amount;
    const days = (new Date(dep.endDate).getTime() - new Date(dep.startDate).getTime()) / (1000 * 60 * 60 * 24);
    const years = days / 365;
    return dep.amount * (1 + 0.025 * years);
 }

  private showSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => this.successMsg = '', 3000);
  }
}
