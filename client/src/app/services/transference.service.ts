import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Transference, Account } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TransferenceService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private base = 'http://localhost:8080/transferences';
  private accountBase = 'http://localhost:8080/accounts';

  getAll(): Observable<Transference[]> { return this.http.get<Transference[]>(`${this.base}/getAll`); }
  getById(id: number): Observable<Transference> { return this.http.get<Transference>(`${this.base}/getById/${id}`); }
  add(t: Transference): Observable<void> {
    return this.http.post<void>(`${this.base}/add`, t).pipe(
      tap(() => {
        const current = this.authService.currentAccount();
        if (current) {
          const newBalance = current.balance - t.amount;
          this.authService.updateBalance(newBalance);
        }
      })
    );
  }
  update(t: Transference): Observable<void> { return this.http.put<void>(`${this.base}/update`, t); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
