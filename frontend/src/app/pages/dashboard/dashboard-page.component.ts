import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastService } from '../../services/forecast.service';
import { ForecastResponse } from '../../models/models';

@Component({ standalone: true, imports: [CommonModule], template: `<div class='card' *ngIf='forecast'>
<h2>Dashboard</h2>
<p>Saldo final previsto: {{forecast.metrics.finalBalance | currency:'BRL'}}</p>
<p>Saldo mínimo previsto: {{forecast.metrics.minBalance | currency:'BRL'}}</p>
<p>Dias negativos: {{forecast.metrics.negativeDays}}</p>
<h3>Metas</h3><ul><li *ngFor='let g of forecast.goals'>{{g.goalName}} - {{g.estimatedHitDate || 'não atingida'}}</li></ul></div>` })
export class DashboardPageComponent implements OnInit {
  private forecastService = inject(ForecastService);
  forecast?: ForecastResponse;
  ngOnInit() { this.forecastService.getForecast().subscribe(v => this.forecast = v); }
}
