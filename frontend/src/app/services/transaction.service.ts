import { Injectable } from '@angular/core';
import { TransactionDto } from '../models/models';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class TransactionService extends BaseApiService {
  list() { return this.http.get<TransactionDto[]>(`${this.api}/transactions`); }
  create(payload: Omit<TransactionDto, 'id'>) { return this.http.post<TransactionDto>(`${this.api}/transactions`, payload); }
}
