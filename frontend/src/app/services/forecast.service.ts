import { Injectable } from '@angular/core';
import { ForecastResponse, SimulateImpactResponse, SimulateRequest } from '../models/models';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class ForecastService extends BaseApiService {
  getForecast() { return this.http.get<ForecastResponse>(`${this.api}/forecast`); }
  simulate(payload: SimulateRequest) { return this.http.post<SimulateImpactResponse>(`${this.api}/simulate`, payload); }
}
