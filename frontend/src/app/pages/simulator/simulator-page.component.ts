import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ForecastService } from '../../services/forecast.service';
import { GoalImpact, SimulateImpactResponse } from '../../models/models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; }
    .result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px; margin-top: 12px; }
    .metric-card { border: 1px solid #dde3ef; border-radius: 10px; padding: 12px; background: #fbfcff; }
    .metric-card h3 { margin: 0 0 8px; font-size: 15px; }
    .metric-line { display: flex; justify-content: space-between; margin: 4px 0; }
    .helper { font-size: 13px; color: #546278; margin: 6px 0; }
    .alert { border: 1px solid #f0d9a8; background: #fff8e8; border-radius: 8px; padding: 10px; margin-top: 8px; }
    .goals { margin-top: 12px; }
    .goals ul { margin: 6px 0 0 16px; }
  `],
  template: `<div class='card'>
    <h2>Simulador de impacto</h2>

    <form (ngSubmit)='simulate()'>
      <div class='form-grid'>
        <label>Valor
          <input [(ngModel)]='amount' name='amount' type='number' min='0.01' step='0.01' placeholder='300' required>
        </label>
        <label>Data da transação
          <input [(ngModel)]='date' name='date' type='date' required>
        </label>
        <label>Período - de
          <input [(ngModel)]='from' name='from' type='date' required>
        </label>
        <label>Período - até
          <input [(ngModel)]='to' name='to' type='date' required>
        </label>
        <label>AccountId (opcional)
          <input [(ngModel)]='accountId' name='accountId' placeholder='GUID opcional'>
        </label>
      </div>

      <button type='submit' [disabled]='loading'>{{ loading ? 'Simulando...' : 'Simular' }}</button>
      <p class='helper'>Tipo enviado: <strong>EXPENSE</strong>.</p>
    </form>

    <p *ngIf='loading'>Carregando simulação...</p>
    <p *ngIf='errorMessage' class='alert'>{{ errorMessage }}</p>
    <p *ngIf='!loading && !result && !errorMessage'>Faça uma simulação para ver o impacto.</p>

    <ng-container *ngIf='result'>
      <div class='result-grid'>
        <div class='metric-card'>
          <h3>Saldo mínimo</h3>
          <div class='metric-line'><span>Baseline</span><strong>{{ formatCurrency(result.baselineMetrics.minBalance) }}</strong></div>
          <div class='metric-line'><span>Simulado</span><strong>{{ formatCurrency(result.simulatedMetrics.minBalance) }}</strong></div>
          <div class='metric-line'><span>Δ</span><strong>{{ formatDeltaCurrency(result.minBalanceDelta) }}</strong></div>
          <small>{{ improvementLabel(result.minBalanceDelta) }}</small>
        </div>

        <div class='metric-card'>
          <h3>Dias no negativo</h3>
          <div class='metric-line'><span>Baseline</span><strong>{{ formatDays(result.baselineMetrics.negativeDays) }}</strong></div>
          <div class='metric-line'><span>Simulado</span><strong>{{ formatDays(result.simulatedMetrics.negativeDays) }}</strong></div>
          <div class='metric-line'><span>Δ</span><strong>{{ formatDeltaNumber(negativeDaysDelta) }}</strong></div>
          <small>{{ negativeDaysDelta <= 0 ? 'melhora' : 'piora' }}</small>
        </div>

        <div class='metric-card'>
          <h3>Saldo final</h3>
          <div class='metric-line'><span>Baseline</span><strong>{{ formatCurrency(result.baselineMetrics.finalBalance) }}</strong></div>
          <div class='metric-line'><span>Simulado</span><strong>{{ formatCurrency(result.simulatedMetrics.finalBalance) }}</strong></div>
          <div class='metric-line'><span>Δ</span><strong>{{ formatDeltaCurrency(finalBalanceDelta) }}</strong></div>
          <small>{{ improvementLabel(finalBalanceDelta) }}</small>
        </div>
      </div>

      <div *ngIf='result.enteredNegativeAfterSimulation' class='alert'>
        Essa simulação faz você entrar no negativo no período.
      </div>

      <div *ngIf='negativeDaysDelta > 0' class='alert'>
        Aumentou {{ negativeDaysDelta }} dias negativos.
      </div>

      <div class='goals'>
        <h3>Metas atingidas no período</h3>
        <ul *ngIf='hitGoals.length > 0'>
          <li *ngFor='let goal of hitGoals'>
            {{ goal.goalName }} (estimada: {{ goal.estimatedHitDate || 'sem data' }})
          </li>
        </ul>
        <p *ngIf='hitGoals.length === 0'>Nenhuma meta atingida.</p>
      </div>
    </ng-container>
  </div>`
})
export class SimulatorPageComponent {
  private service = inject(ForecastService);
  private currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  amount = 0;
  date = this.asDateInput(new Date());
  from = this.asDateInput(new Date());
  to = this.asDateInput(this.addDays(new Date(), 30));
  accountId = '';

  loading = false;
  errorMessage = '';
  result?: SimulateImpactResponse;

  get negativeDaysDelta(): number {
    if (!this.result) return 0;
    return this.result.simulatedMetrics.negativeDays - this.result.baselineMetrics.negativeDays;
  }

  get finalBalanceDelta(): number {
    if (!this.result) return 0;
    return this.result.simulatedMetrics.finalBalance - this.result.baselineMetrics.finalBalance;
  }

  get hitGoals(): GoalImpact[] {
    return this.result?.goalsAfterSimulation.filter(g => g.isHitInRange) ?? [];
  }

  simulate() {
    this.loading = true;
    this.errorMessage = '';

    this.service.simulate(
      {
        amount: this.amount,
        date: this.date,
        type: 'EXPENSE',
        accountId: this.accountId.trim() ? this.accountId.trim() : undefined
      },
      this.from,
      this.to
    )
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe({
        next: v => { this.result = v; },
        error: () => {
          this.result = undefined;
          this.errorMessage = 'Não foi possível simular. Tente novamente.';
        }
      });
  }

  formatCurrency(value: number): string {
    return this.currencyFormatter.format(value);
  }

  formatDeltaCurrency(value: number): string {
    const signal = value >= 0 ? '+' : '-';
    return `Δ ${signal}${this.currencyFormatter.format(Math.abs(value))}`;
  }

  formatDeltaNumber(value: number): string {
    const signal = value >= 0 ? '+' : '-';
    return `Δ ${signal}${Math.abs(Math.trunc(value))}`;
  }

  formatDays(value: number): string {
    return `${Math.trunc(value)}`;
  }

  improvementLabel(delta: number): string {
    return delta >= 0 ? 'melhora' : 'piora';
  }

  private asDateInput(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }
}
