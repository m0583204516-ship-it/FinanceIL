import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/users';

  getAll(): Observable<User[]> { return this.http.get<User[]>(`${this.base}/getAll`); }
  getById(id: string): Observable<User> { return this.http.get<User>(`${this.base}/getById/${id}`); }
  add(u: User): Observable<void> { return this.http.post<void>(`${this.base}/add`, u); }
  update(u: User): Observable<void> { return this.http.put<void>(`${this.base}/update`, u); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
