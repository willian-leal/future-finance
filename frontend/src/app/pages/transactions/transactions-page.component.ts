import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { TransactionDto } from '../../models/models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<section class='page-card'>
    <header class='page-header'>
      <h2>Transações</h2>
      <p>Registre receitas e despesas por conta e categoria.</p>
    </header>

    <form class='section grid two' (ngSubmit)='save()'>
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
          <input [(ngModel)]='form.amount' name='amount' type='number' min='0.01' step='0.01' placeholder='0,00'>
        </div>
      </div>

      <div class='field'>
        <label>Data</label>
        <input [(ngModel)]='form.date' name='date' type='date'>
      </div>

      <div class='field'>
        <label>Descrição</label>
        <input [(ngModel)]='form.description' name='description' placeholder='Descrição'>
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
      <div class='row' *ngFor='let t of items'>
        <div>
          <div class='row-title'>{{ t.description }}</div>
          <div class='row-subtitle'>{{ t.date }} • {{ t.category }}</div>
        </div>
        <div class='row-value'>
          <span class='badge' [class.expense]='isExpense(t.type)' [class.income]='!isExpense(t.type)'>{{ t.type }}</span>
          <div>{{ t.amount | currency:'BRL' }}</div>
        </div>
      </div>
      <div class='row' *ngIf='items.length === 0'>
        <div class='row-subtitle'>Nenhuma transação cadastrada.</div>
      </div>
    </section>
  </section>`
})
export class TransactionsPageComponent implements OnInit {
  private service = inject(TransactionService);
  items: TransactionDto[] = [];
  form: any = { type: 'Expense', amount: 0, date: new Date().toISOString().slice(0, 10), description: '', category: '', accountId: '' };

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
