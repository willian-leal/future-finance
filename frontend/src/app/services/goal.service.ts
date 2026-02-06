import { Injectable } from '@angular/core';
import { GoalDto } from '../models/models';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class GoalService extends BaseApiService {
  list() { return this.http.get<GoalDto[]>(`${this.api}/goals`); }
  create(payload: Omit<GoalDto, 'id'>) { return this.http.post<GoalDto>(`${this.api}/goals`, payload); }
}
