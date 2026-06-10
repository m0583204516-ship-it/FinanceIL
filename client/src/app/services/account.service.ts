import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/accounts';

  getAll(): Observable<Account[]> { return this.http.get<Account[]>(`${this.base}/getAll`); }
  getById(id: number): Observable<Account> { return this.http.get<Account>(`${this.base}/getById/${id}`); }
  add(a: Account): Observable<void> { return this.http.post<void>(`${this.base}/add`, a); }
  update(a: Account): Observable<void> { return this.http.put<void>(`${this.base}/update`, a); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }

  login(email: string, password: string): Observable<Account> {
    return this.http.post<Account>(`${this.base}/login`, { email, password });
  }
}
