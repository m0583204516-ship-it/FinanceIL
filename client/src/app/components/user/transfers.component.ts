import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransferenceService } from '../../services/transference.service';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Transference, Account } from '../../models/models';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in" style="direction:rtl">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 class="text-xl font-bold" style="color:#0F172A">העברות כספים</h2>
          <p class="text-xs mt-1" style="color:#94A3B8">{{ transfers.length }} העברות</p>
        </div>
        <button class="btn-primary text-sm" (click)="openTransferModal()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3L4 7l4 4"/><path d="M4 7h16"/><path d="M16 21l4-4-4-4"/><path d="M20 17H4"/>
          </svg>
          העברה חדשה
        </button>
      </div>
      <div class="card" *ngIf="!loading">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom:2px solid #F1F5F9">
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">#</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">מחשבון</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">לחשבון</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">תאריך</th>
              <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">כיוון</th>
              <th class="text-left pb-3 text-xs font-semibold" style="color:#94A3B8">סכום</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of transfers" class="table-row">
              <td class="py-3 text-xs" style="color:#94A3B8">#{{ t.idTransference }}</td>
              <td class="py-3 text-sm font-medium" style="color:#334155">#{{ t.fromAccount?.idAccount }}</td>
              <td class="py-3 text-sm font-medium" style="color:#334155">#{{ t.toAccount?.idAccount }}</td>
              <td class="py-3 text-xs" style="color:#94A3B8">{{ t.date | date:'dd/MM/yyyy HH:mm' }}</td>
              <td class="py-3">
                <span *ngIf="isOutgoing(t)" class="badge-danger">יוצאת</span>
                <span *ngIf="!isOutgoing(t)" class="badge-success">נכנסת</span>
              </td>
              <td class="py-3 text-left font-bold"
                  [style.color]="isOutgoing(t) ? '#DC2626' : '#059669'">
                {{ isOutgoing(t) ? '-' : '+' }}₪{{ t.amount | number:'1.0-0' }}
              </td>
            </tr>
            <tr *ngIf="transfers.length === 0">
              <td colspan="6" class="py-10 text-center text-sm" style="color:#94A3B8">אין העברות</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="skeleton h-64 rounded-2xl" *ngIf="loading"></div>
      <div *ngIf="errorMsg" class="mt-3 p-3 rounded-xl text-sm" style="background:#FEF2F2;border:1px solid #FECACA;color:#DC2626">{{ errorMsg }}</div>
      <div *ngIf="successMsg" class="mt-3 p-3 rounded-xl text-sm" style="background:#ECFDF5;border:1px solid #A7F3D0;color:#059669">{{ successMsg }}</div>
    </div>
    <div class="modal-overlay" *ngIf="showModal" (click)="$event.target === $event.currentTarget && closeModal()">
      <div class="modal-box" style="direction:rtl">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold" style="color:#0F172A">העברת כספים</h2>
          <button class="p-1.5 rounded-lg hover:bg-slate-100" style="color:#64748B" (click)="closeModal()">✕</button>
        </div>
        <div class="flex items-center gap-2 mb-6" *ngIf="!transferSuccess">
          <ng-container *ngFor="let s of [1,2,3]; let i = index">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                 [style.background]="step >= s ? '#6366F1' : '#E2E8F0'"
                 [style.color]="step >= s ? 'white' : '#94A3B8'">{{ s }}</div>
            <div *ngIf="i < 2" class="h-0.5 flex-1 rounded transition-all"
                 [style.background]="step > s ? '#6366F1' : '#E2E8F0'"></div>
          </ng-container>
          <span class="text-xs mr-3" style="color:#64748B">
            {{ step === 1 ? 'בחר נמען' : step === 2 ? 'הכנס סכום' : 'אישור' }}
          </span>
        </div>
        <div *ngIf="step === 1 && !transferSuccess" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2" style="color:#334155">מספר חשבון נמען</label>
            <input type="number" class="input-field" placeholder="הכנס מספר חשבון" [(ngModel)]="toAccountId" (keyup.enter)="nextStep()"/>
          </div>
          <p *ngIf="formError" class="text-sm" style="color:#EF4444">{{ formError }}</p>
        </div>
        <div *ngIf="step === 2 && !transferSuccess" class="flex flex-col gap-4">
          <div class="p-3 rounded-xl flex items-center gap-3" style="background:#F8FAFC;border:1px solid #E2E8F0">
            <span class="text-sm" style="color:#64748B">העברה לחשבון:</span>
            <span class="font-bold" style="color:#0F172A">#{{ toAccountId }}</span>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2" style="color:#334155">סכום (₪)</label>
            <input type="number" class="input-field text-xl font-bold" placeholder="0.00" [(ngModel)]="amount" (keyup.enter)="nextStep()"/>
          </div>
          <div class="flex justify-between text-xs px-1">
            <span style="color:#64748B">יתרה נוכחית:</span>
            <span class="font-bold" [style.color]="amount > currentBalance ? '#EF4444' : '#059669'">₪{{ currentBalance | number:'1.0-0' }}</span>
          </div>
          <p *ngIf="formError" class="text-sm" style="color:#EF4444">{{ formError }}</p>
        </div>
        <div *ngIf="step === 3 && !transferSuccess" class="flex flex-col gap-3">
          <div class="rounded-xl p-4" style="background:#F8FAFC;border:1px solid #E2E8F0">
            <div class="flex justify-between py-2.5 border-b" style="border-color:#E2E8F0">
              <span class="text-sm" style="color:#64748B">מחשבון</span>
              <span class="font-bold" style="color:#0F172A">#{{ currentAccount?.idAccount }}</span>
            </div>
            <div class="flex justify-between py-2.5 border-b" style="border-color:#E2E8F0">
              <span class="text-sm" style="color:#64748B">לחשבון</span>
              <span class="font-bold" style="color:#0F172A">#{{ toAccountId }}</span>
            </div>
            <div class="flex justify-between py-2.5">
              <span class="text-sm" style="color:#64748B">סכום</span>
              <span class="text-2xl font-extrabold" style="color:#6366F1">₪{{ amount | number:'1.2-2' }}</span>
            </div>
          </div>
          <p *ngIf="formError" class="text-sm text-center" style="color:#EF4444">{{ formError }}</p>
        </div>
        <div *ngIf="transferSuccess" class="text-center py-6">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background:#ECFDF5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p class="font-bold text-lg" style="color:#0F172A">ההעברה בוצעה בהצלחה!</p>
          <p class="text-sm mt-1" style="color:#64748B">₪{{ amount | number:'1.2-2' }} הועברו לחשבון #{{ toAccountId }}</p>
          <button class="btn-primary mt-5 px-8" (click)="closeModal()">סגור</button>
        </div>
        <div *ngIf="!transferSuccess" class="flex gap-3 mt-6">
          <button *ngIf="step > 1" class="btn-ghost flex-1" (click)="step = step - 1">חזור</button>
          <button class="btn-primary flex-1" (click)="nextStep()" [disabled]="saving || isNextDisabled()">
            <svg *ngIf="saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"/>
              <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ saving ? 'מעבד...' : step === 3 ? 'אשר העברה' : 'המשך' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TransfersComponent implements OnInit {
  pageTitle = 'העברות';
  private transferenceService = inject(TransferenceService);
  private accountService = inject(AccountService);
  private authService = inject(AuthService);

  transfers: Transference[] = [];
  loading = true;
  saving = false;
  showModal = false;
  step = 1;
  toAccountId: number | null = null;
  amount = 0;
  formError = '';
  errorMsg = '';
  successMsg = '';
  transferSuccess = false;
  toAccount: Account | null = null;

  get currentAccount() { return this.authService.currentAccount(); }
  get currentBalance() { return this.currentAccount?.balance ?? 0; }

  ngOnInit() { this.loadTransfers(); }

  loadTransfers() {
    this.loading = true;
    this.transferenceService.getAll().subscribe({
      next: (data: Transference[]) => {
        const accId = this.currentAccount?.idAccount;
        this.transfers = data.filter((t: Transference) =>
          t.fromAccount?.idAccount === accId || t.toAccount?.idAccount === accId
        );
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openTransferModal() {
    this.step = 1;
    this.toAccountId = null;
    this.amount = 0;
    this.formError = '';
    this.transferSuccess = false;
    this.toAccount = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    if (this.transferSuccess) this.loadTransfers();
  }

  isNextDisabled(): boolean {
    if (this.step === 1) return !this.toAccountId;
    if (this.step === 2) return !this.amount || this.amount <= 0;
    return false;
  }

  nextStep() {
    this.formError = '';

    if (this.step === 1) {
      this.saving = true;
      this.accountService.getById(this.toAccountId!).subscribe({
        next: (acc) => {
          this.saving = false;
          if (acc.idAccount === this.currentAccount?.idAccount) {
            this.formError = 'לא ניתן להעביר לאותו חשבון';
            return;
          }
          this.toAccount = acc;
          this.step = 2;
        },
        error: () => {
          this.saving = false;
          this.formError = 'חשבון נמען לא נמצא, בדוק את המספר ונסה שנית';
        }
      });

    } else if (this.step === 2) {
      if (this.amount > this.currentBalance) {
        this.formError = 'אין מספיק יתרה בחשבון';
        return;
      }
      if (this.amount <= 0) {
        this.formError = 'הסכום חייב להיות גדול מ-0';
        return;
      }
      this.step = 3;

    } else if (this.step === 3) {
      const fromAccount = this.currentAccount;
      if (!fromAccount || !this.toAccount) return;

      const payload: Transference = {
        amount: this.amount,
        date: new Date().toISOString(),
        fromAccount: fromAccount,
        toAccount: this.toAccount,
      };

      this.saving = true;
      this.transferenceService.add(payload).subscribe({
        next: () => {
          this.saving = false;
          this.transferSuccess = true;
        },
        error: () => {
          this.saving = false;
          this.formError = 'שגיאה בביצוע ההעברה, נסה שנית';
        }
      });
    }
  }

  isOutgoing(t: Transference): boolean {
    return t.fromAccount?.idAccount === this.currentAccount?.idAccount;
  }
}
