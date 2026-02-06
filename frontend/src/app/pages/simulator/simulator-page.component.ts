import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ForecastService } from '../../services/forecast.service';
import { GoalImpact, SimulateImpactResponse } from '../../models/models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<section class='page-card'>
    <header class='page-header'>
      <h2>Simulador</h2>
      <p>Simule um gasto hoje e veja o impacto no saldo e nas metas dentro do período.</p>
    </header>

    <form class='section grid two' (ngSubmit)='simulate()'>
      <div class='field'>
        <label>Valor</label>
        <div class='currency-input'>
          <span>R$</span>
          <input [(ngModel)]='amount' name='amount' type='number' min='0.01' step='0.01' placeholder='300' required>
        </div>
      </div>

      <div class='field'>
        <label>Data da transação</label>
        <input [(ngModel)]='date' name='date' type='date' required>
      </div>

      <div class='field'>
        <label>Período (de)</label>
        <input [(ngModel)]='from' name='from' type='date' required>
      </div>

      <div class='field'>
        <label>Período (até)</label>
        <input [(ngModel)]='to' name='to' type='date' required>
      </div>

      <div class='field'>
        <label>AccountId (opcional)</label>
        <input [(ngModel)]='accountId' name='accountId' placeholder='GUID da conta'>
        <p class='helper-text'>Use somente se quiser atrelar a simulação a uma conta específica.</p>
      </div>

      <div class='field'>
        <label>Tipo</label>
        <input value='EXPENSE' disabled>
      </div>

      <div>
        <button class='btn btn-primary' type='submit' [disabled]='loading'>{{ loading ? 'Simulando...' : 'Simular' }}</button>
      </div>
    </form>

    <p *ngIf='loading' class='empty-state'>Calculando impacto...</p>
    <p *ngIf='errorMessage' class='alert warning'>{{ errorMessage }}</p>
    <p *ngIf='!loading && !result && !errorMessage' class='empty-state'>Faça uma simulação para ver o impacto.</p>

    <ng-container *ngIf='result'>
      <div class='metrics'>
        <article class='metric-card'>
          <h3>Saldo mínimo</h3>
          <div class='metric-line'><span>Baseline</span><strong>{{ formatCurrency(result.baselineMetrics.minBalance) }}</strong></div>
          <div class='metric-line'><span>Simulado</span><strong>{{ formatCurrency(result.simulatedMetrics.minBalance) }}</strong></div>
          <div class='metric-line'><span>Delta</span><strong>{{ formatDeltaCurrency(result.minBalanceDelta) }}</strong></div>
          <span class='badge' [class.good]='result.minBalanceDelta >= 0' [class.bad]='result.minBalanceDelta < 0'>{{ improvementLabel(result.minBalanceDelta) }}</span>
        </article>

        <article class='metric-card'>
          <h3>Dias no negativo</h3>
          <div class='metric-line'><span>Baseline</span><strong>{{ formatDays(result.baselineMetrics.negativeDays) }}</strong></div>
          <div class='metric-line'><span>Simulado</span><strong>{{ formatDays(result.simulatedMetrics.negativeDays) }}</strong></div>
          <div class='metric-line'><span>Delta</span><strong>{{ formatDeltaNumber(negativeDaysDelta) }}</strong></div>
          <span class='badge' [class.good]='negativeDaysDelta <= 0' [class.bad]='negativeDaysDelta > 0'>{{ negativeDaysDelta <= 0 ? 'melhora' : 'piora' }}</span>
        </article>

        <article class='metric-card'>
          <h3>Saldo final</h3>
          <div class='metric-line'><span>Baseline</span><strong>{{ formatCurrency(result.baselineMetrics.finalBalance) }}</strong></div>
          <div class='metric-line'><span>Simulado</span><strong>{{ formatCurrency(result.simulatedMetrics.finalBalance) }}</strong></div>
          <div class='metric-line'><span>Delta</span><strong>{{ formatDeltaCurrency(finalBalanceDelta) }}</strong></div>
          <span class='badge' [class.good]='finalBalanceDelta >= 0' [class.bad]='finalBalanceDelta < 0'>{{ improvementLabel(finalBalanceDelta) }}</span>
        </article>
      </div>

      <div *ngIf='result.enteredNegativeAfterSimulation' class='alert danger'>
        Essa simulação faz você entrar no negativo no período.
      </div>

      <div *ngIf='negativeDaysDelta > 0' class='alert warning'>
        Aumentou {{ negativeDaysDelta }} dias negativos.
      </div>

      <section class='list-card section'>
        <div class='row'>
          <div class='row-title'>Metas no período</div>
        </div>
        <ng-container *ngIf='hitGoals.length > 0'>
          <div class='row' [style.grid-template-columns]="'1fr auto'" *ngFor='let goal of hitGoals'>
            <div>
              <div class='row-title'>{{ goal.goalName }}</div>
              <div class='row-subtitle'>Estimada em: {{ goal.estimatedHitDate || 'sem data' }}</div>
            </div>
            <div class='row-value'><span class='badge good'>ATINGIDA</span></div>
          </div>
        </ng-container>
        <div class='row' *ngIf='hitGoals.length === 0'>
          <div class='row-subtitle'>Nenhuma meta atingida.</div>
        </div>
      </section>
    </ng-container>
  </section>`
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
