import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { TransactionDto } from '../../models/models';

@Component({ standalone: true, imports: [CommonModule, FormsModule], template: `<div class='card'><h2>Transações</h2>
<form (ngSubmit)='save()'>
<select [(ngModel)]='form.type' name='type'><option value='Income'>INCOME</option><option value='Expense'>EXPENSE</option></select>
<input [(ngModel)]='form.amount' name='amount' type='number' placeholder='Valor'>
<input [(ngModel)]='form.date' name='date' type='date'>
<input [(ngModel)]='form.description' name='description' placeholder='Descrição'>
<input [(ngModel)]='form.category' name='category' placeholder='Categoria'>
<input [(ngModel)]='form.accountId' name='accountId' placeholder='AccountId'>
<button type='submit'>Salvar</button></form>
<ul><li *ngFor='let t of items'>{{t.date}} - {{t.description}} - {{t.amount}}</li></ul></div>` })
export class TransactionsPageComponent implements OnInit {
  private service = inject(TransactionService);
  items: TransactionDto[] = [];
  form: any = { type: 'Expense', amount: 0, date: new Date().toISOString().slice(0,10), description: '', category: '', accountId: '' };
  ngOnInit() { this.load(); }
  load() { this.service.list().subscribe(v => this.items = v); }
  save() { this.service.create(this.form).subscribe(() => this.load()); }
}
