import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ForecastResponse, SimulateImpactResponse, SimulateRequest } from '../models/models';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class ForecastService extends BaseApiService {
  getForecast() {
    return this.http.get<ForecastResponse>(`${this.api}/forecast`);
  }

  simulate(payload: SimulateRequest, from: string, to: string) {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.post<SimulateImpactResponse>(`${this.api}/simulate`, payload, { params });
  }
}
