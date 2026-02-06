import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { GoalDto } from '../../models/models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<section class='page-card'>
    <header class='page-header'>
      <h2>Metas</h2>
      <p>Acompanhe objetivos financeiros com prioridade e data alvo.</p>
    </header>

    <form class='section grid two' (ngSubmit)='save()'>
      <div class='field'>
        <label>Nome da meta</label>
        <input [(ngModel)]='form.name' name='name' placeholder='Ex.: Reserva de emergência'>
      </div>

      <div class='field'>
        <label>Valor alvo</label>
        <div class='currency-input'>
          <span>R$</span>
          <input [(ngModel)]='form.targetAmount' name='targetAmount' type='number' min='1' step='0.01'>
        </div>
      </div>

      <div class='field'>
        <label>Data alvo</label>
        <input [(ngModel)]='form.targetDate' name='targetDate' type='date'>
      </div>

      <div class='field'>
        <label>Prioridade (1-10)</label>
        <input [(ngModel)]='form.priority' name='priority' type='number' min='1' max='10'>
      </div>

      <div>
        <button class='btn btn-primary' type='submit'>Salvar</button>
      </div>
    </form>

    <section class='list-card'>
      <div class='row' *ngFor='let g of items'>
        <div>
          <div class='row-title'>{{ g.name }}</div>
          <div class='row-subtitle'>Alvo: {{ g.targetDate }}</div>
        </div>
        <div class='row-value'>
          <div>{{ g.targetAmount | currency:'BRL' }}</div>
          <span class='badge'>Prioridade {{ g.priority }}</span>
        </div>
      </div>
      <div class='row' *ngIf='items.length === 0'>
        <div class='row-subtitle'>Nenhuma meta cadastrada.</div>
      </div>
    </section>
  </section>`
})
export class GoalsPageComponent implements OnInit {
  private service = inject(GoalService);
  items: GoalDto[] = [];
  form: any = { name: '', targetAmount: 0, targetDate: new Date().toISOString().slice(0, 10), priority: 1 };

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.list().subscribe(v => this.items = v);
  }

  save() {
    this.service.create(this.form).subscribe(() => this.load());
  }
}
