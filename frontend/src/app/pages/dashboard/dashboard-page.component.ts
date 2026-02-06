import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastService } from '../../services/forecast.service';
import { ForecastResponse } from '../../models/models';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `<section class='page-card'>
    <header class='page-header'>
      <h2>Dashboard</h2>
      <p>Resumo do cenário financeiro previsto para os próximos dias.</p>
    </header>

    <p *ngIf='!forecast' class='empty-state'>Carregando resumo...</p>

    <ng-container *ngIf='forecast'>
      <div class='metrics'>
        <article class='metric-card'>
          <h3>Saldo final previsto</h3>
          <p>{{ forecast.metrics.finalBalance | currency:'BRL' }}</p>
        </article>
        <article class='metric-card'>
          <h3>Saldo mínimo previsto</h3>
          <p>{{ forecast.metrics.minBalance | currency:'BRL' }}</p>
        </article>
        <article class='metric-card'>
          <h3>Dias no negativo</h3>
          <p>{{ forecast.metrics.negativeDays }}</p>
        </article>
      </div>

      <section class='list-card'>
        <div class='row' *ngFor='let g of forecast.goals'>
          <div>
            <div class='row-title'>{{ g.goalName }}</div>
            <div class='row-subtitle'>Data estimada: {{ g.estimatedHitDate || 'não atingida no período' }}</div>
          </div>
          <div class='row-value'>
            <span class='badge' [class.good]='g.isHitInRange' [class.bad]='!g.isHitInRange'>{{ g.isHitInRange ? 'ATINGIDA' : 'PENDENTE' }}</span>
          </div>
        </div>
      </section>
    </ng-container>
  </section>`
})
export class DashboardPageComponent implements OnInit {
  private forecastService = inject(ForecastService);
  forecast?: ForecastResponse;

  ngOnInit() {
    this.forecastService.getForecast().subscribe(v => this.forecast = v);
  }
}
