import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForecastService } from '../../services/forecast.service';
import { SimulateImpactResponse } from '../../models/models';

@Component({ standalone: true, imports: [CommonModule, FormsModule], template: `<div class='card'><h2>Simulador</h2>
<form (ngSubmit)='simulate()'>
<input [(ngModel)]='amount' name='amount' type='number' placeholder='Valor'>
<input [(ngModel)]='date' name='date' type='date'>
<button>Simular</button></form>
<div *ngIf='result'>
<p>Min balance delta: {{result.minBalanceDelta | currency:'BRL'}}</p>
<p>Entrou negativo? {{result.enteredNegativeAfterSimulation ? 'Sim' : 'Não'}}</p>
</div></div>` })
export class SimulatorPageComponent {
  private service = inject(ForecastService);
  amount = 0;
  date = new Date().toISOString().slice(0,10);
  result?: SimulateImpactResponse;
  simulate() { this.service.simulate({ amount: this.amount, date: this.date, type: 'Expense' }).subscribe(v => this.result = v); }
}
