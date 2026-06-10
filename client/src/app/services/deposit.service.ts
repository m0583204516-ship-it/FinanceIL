import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Deposit } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DepositService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/deposits';

  getAll(): Observable<Deposit[]> { return this.http.get<Deposit[]>(`${this.base}/getAll`); }
  getById(id: number): Observable<Deposit> { return this.http.get<Deposit>(`${this.base}/getById/${id}`); }
  add(d: Deposit): Observable<void> { return this.http.post<void>(`${this.base}/add`, d); }
  update(d: Deposit): Observable<void> { return this.http.put<void>(`${this.base}/update`, d); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
