import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Income } from '../models/models';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/incomes';

  getAll(): Observable<Income[]> { return this.http.get<Income[]>(`${this.base}/getAll`); }
  getById(id: number): Observable<Income> { return this.http.get<Income>(`${this.base}/getById/${id}`); }
  add(i: Income): Observable<void> { return this.http.post<void>(`${this.base}/add`, i); }
  update(i: Income): Observable<void> { return this.http.put<void>(`${this.base}/update`, i); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
