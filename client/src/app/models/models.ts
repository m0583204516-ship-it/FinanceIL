export interface User {
  idUser: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
}

export type AccountType = 'PRIVATE' | 'BUSINESS';
export type Rools = 'ADMIN' | 'USER';

export interface Account {
  idAccount?: number;
  email?: string;
  password: string;
  balance: number;
  user: User;
  type: AccountType;
  rool: Rools;
}

export interface Income {
  idIncome?: number;
  amount: number;
  source: string;
  description: string;
  incomeDate: string;
  owner: User;
}

export interface Expense {
  idExpense?: number;
  amount: number;
  category: string;
  description: string;
  expenseDate: string;
  isCanceled: boolean;
  isFutureExpense: boolean;
  owner: User;
}

export interface Deposit {
  idDeposit?: number;
  amount: number;
  depositType: string;
  startDate: string;
  endDate: string;
  isReleased: boolean;
  owner: User;
}

export interface Transference {
  idTransference?: number;
  amount: number;
  date: string;
  fromAccount: Account;
  toAccount: Account;
}

export interface AuthSession {
  account: Account;
  isAdmin: boolean;
}
