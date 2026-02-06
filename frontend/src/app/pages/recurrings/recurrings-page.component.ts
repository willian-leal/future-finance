import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecurringService } from '../../services/recurring.service';
import { RecurringDto } from '../../models/models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<section class='page-card'>
    <header class='page-header'>
      <h2>Recorrências</h2>
      <p>Configure eventos automáticos como salário, aluguel e assinaturas.</p>
    </header>

    <form class='section grid two' (ngSubmit)='save()'>
      <div class='field'>
        <label>Nome</label>
        <input [(ngModel)]='form.name' name='name' placeholder='Ex.: Aluguel'>
      </div>

      <div class='field'>
        <label>Tipo</label>
        <select [(ngModel)]='form.type' name='type'>
          <option value='Income'>INCOME</option>
          <option value='Expense'>EXPENSE</option>
        </select>
      </div>

      <div class='field'>
        <label>Valor</label>
        <div class='currency-input'>
          <span>R$</span>
          <input [(ngModel)]='form.amount' name='amount' type='number' min='0.01' step='0.01'>
        </div>
      </div>

      <div class='field'>
        <label>Frequência</label>
        <select [(ngModel)]='form.frequency' name='frequency'>
          <option value='Daily'>DAILY</option>
          <option value='Weekly'>WEEKLY</option>
          <option value='Monthly'>MONTHLY</option>
        </select>
      </div>

      <div class='field'>
        <label>Próxima execução</label>
        <input [(ngModel)]='form.nextRunDate' name='nextRunDate' type='date'>
      </div>

      <div class='field'>
        <label>Categoria</label>
        <input [(ngModel)]='form.category' name='category' placeholder='Categoria'>
      </div>

      <div class='field'>
        <label>AccountId</label>
        <input [(ngModel)]='form.accountId' name='accountId' placeholder='GUID da conta'>
      </div>

      <div>
        <button class='btn btn-primary' type='submit'>Salvar</button>
      </div>
    </form>

    <section class='list-card'>
      <div class='row' *ngFor='let r of items'>
        <div>
          <div class='row-title'>{{ r.name }}</div>
          <div class='row-subtitle'>{{ r.nextRunDate }} • {{ r.category }}</div>
        </div>
        <div class='row-value'>
          <div>
            <span class='badge' [class.expense]='isExpense(r.type)' [class.income]='!isExpense(r.type)'>{{ r.type }}</span>
            <span class='badge frequency'>{{ r.frequency }}</span>
          </div>
          <div>{{ r.amount | currency:'BRL' }}</div>
        </div>
      </div>
      <div class='row' *ngIf='items.length === 0'>
        <div class='row-subtitle'>Nenhuma recorrência cadastrada.</div>
      </div>
    </section>
  </section>`
})
export class RecurringsPageComponent implements OnInit {
  private service = inject(RecurringService);
  items: RecurringDto[] = [];
  form: any = { name: '', type: 'Expense', amount: 0, frequency: 'Monthly', nextRunDate: new Date().toISOString().slice(0, 10), category: '', accountId: '' };

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.list().subscribe(v => this.items = v);
  }

  save() {
    this.service.create(this.form).subscribe(() => this.load());
  }

  isExpense(type: string): boolean {
    return type.toUpperCase() === 'EXPENSE';
  }
}
