import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AccountDto } from '../models/models';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class AccountService extends BaseApiService {
  private readonly _accounts = new BehaviorSubject<AccountDto[]>([]);
  readonly accounts$ = this._accounts.asObservable();

  load() { return this.http.get<AccountDto[]>(`${this.api}/accounts`).pipe(tap(v => this._accounts.next(v))); }
  create(payload: Pick<AccountDto, 'name' | 'initialBalance'>) { return this.http.post<AccountDto>(`${this.api}/accounts`, payload).pipe(tap(() => this.load().subscribe())); }
}
