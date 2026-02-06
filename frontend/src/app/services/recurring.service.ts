import { Injectable } from '@angular/core';
import { RecurringDto } from '../models/models';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class RecurringService extends BaseApiService {
  list() { return this.http.get<RecurringDto[]>(`${this.api}/recurrings`); }
  create(payload: Omit<RecurringDto, 'id'>) { return this.http.post<RecurringDto>(`${this.api}/recurrings`, payload); }
}
