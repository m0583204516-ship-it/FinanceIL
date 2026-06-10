import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/expenses';

  getAll(): Observable<Expense[]> { return this.http.get<Expense[]>(`${this.base}/getAll`); }
  getById(id: number): Observable<Expense> { return this.http.get<Expense>(`${this.base}/getById/${id}`); }
  add(e: Expense): Observable<void> { return this.http.post<void>(`${this.base}/add`, e); }
  update(e: Expense): Observable<void> { return this.http.put<void>(`${this.base}/update`, e); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
