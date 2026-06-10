import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/models';

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in" style="direction:rtl">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 class="text-xl font-bold" style="color:#0F172A">ניהול חשבונות</h2>
          <p class="text-xs mt-1" style="color:#94A3B8">{{ filtered.length }} חשבונות</p>
        </div>
        <input class="input-field" style="max-width:220px" placeholder="🔍 חיפוש..." [(ngModel)]="search"/>
      </div>

      <div class="card" *ngIf="!loading">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr style="border-bottom:2px solid var(--gray-200)">
                <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">#</th>
                <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">בעלים</th>
                <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">סוג</th>
                <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">תפקיד</th>
                <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">יתרה</th>
                <th class="text-right pb-3 text-xs font-semibold" style="color:#94A3B8">פעולות</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let acc of filtered" class="table-row">
                <td class="py-3 text-xs" style="color:#94A3B8">#{{ acc.idAccount }}</td>
                <td class="py-3">
                  <div class="flex items-center gap-2">
                    <div class="navbar__avatar" style="width:28px;height:28px;font-size:.75rem;flex-shrink:0">
                      {{ acc.user?.firstName?.charAt(0) }}
                    </div>
                    <span class="font-semibold" style="color:#334155">{{ acc.user?.firstName }} {{ acc.user?.lastName }}</span>
                  </div>
                </td>
                <td class="py-3">
                  <span [class]="acc.type === 'BUSINESS' ? 'badge-info' : 'badge-warning'">
                    {{ acc.type === 'BUSINESS' ? 'עסקי' : 'פרטי' }}
                  </span>
                </td>
                <td class="py-3">
                  <span [class]="acc.rool === 'ADMIN' ? 'badge-danger' : 'badge-success'">
                    {{ acc.rool === 'ADMIN' ? 'מנהל' : 'משתמש' }}
                  </span>
                </td>
                <td class="py-3 font-bold" style="color:var(--green)">₪{{ acc.balance | number:'1.0-0' }}</td>
                <td class="py-3">
                  <button class="btn-edit">עריכה</button>
                </td>
              </tr>
              <tr *ngIf="filtered.length === 0">
                <td colspan="6" class="py-10 text-center text-sm" style="color:#94A3B8">אין חשבונות</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="skeleton h-64 rounded-2xl" *ngIf="loading"></div>
    </div>
  `,
})
export class AdminAccountsComponent implements OnInit {
  pageTitle = 'ניהול חשבונות';
  private accountService = inject(AccountService);

  accounts: Account[] = [];
  loading = true;
  search = '';

  ngOnInit() {
    this.accountService.getAll().subscribe({
      next: (data: Account[]) => { this.accounts = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): Account[] {
    if (!this.search) return this.accounts;
    const q = this.search.toLowerCase();
    return this.accounts.filter((a: Account) =>
      a.user?.firstName?.toLowerCase().includes(q) ||
      a.user?.lastName?.toLowerCase().includes(q) ||
      String(a.idAccount).includes(q)
    );
  }
}
