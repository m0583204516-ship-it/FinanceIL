import { Injectable, signal } from '@angular/core';
import { AuthSession, Account } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionKey = 'finance_session';
  session = signal<AuthSession | null>(this.loadSession());

  private loadSession(): AuthSession | null {
    const stored = localStorage.getItem(this.sessionKey);
    return stored ? JSON.parse(stored) : null;
  }

  login(account: Account): void {
    const sess: AuthSession = { account, isAdmin: account.rool === 'ADMIN' };
    localStorage.setItem(this.sessionKey, JSON.stringify(sess));
    this.session.set(sess);
  }

  updateBalance(newBalance: number): void {
    const sess = this.session();
    if (!sess) return;
    const updated: AuthSession = { ...sess, account: { ...sess.account, balance: newBalance } };
    localStorage.setItem(this.sessionKey, JSON.stringify(updated));
    this.session.set(updated);
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
    this.session.set(null);
  }

  isLoggedIn(): boolean { return this.session() !== null; }
  isAdmin(): boolean { return this.session()?.isAdmin ?? false; }
  currentAccount(): Account | null { return this.session()?.account ?? null; }
}
