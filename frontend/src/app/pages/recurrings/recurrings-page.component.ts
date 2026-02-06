import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecurringService } from '../../services/recurring.service';
import { RecurringDto } from '../../models/models';

@Component({ standalone: true, imports: [CommonModule, FormsModule], template: `<div class='card'><h2>Recorrências</h2>
<form (ngSubmit)='save()'>
<input [(ngModel)]='form.name' name='name' placeholder='Nome'>
<select [(ngModel)]='form.type' name='type'><option value='Income'>INCOME</option><option value='Expense'>EXPENSE</option></select>
<input [(ngModel)]='form.amount' name='amount' type='number'>
<select [(ngModel)]='form.frequency' name='frequency'><option value='Daily'>DAILY</option><option value='Weekly'>WEEKLY</option><option value='Monthly'>MONTHLY</option></select>
<input [(ngModel)]='form.nextRunDate' name='nextRunDate' type='date'>
<input [(ngModel)]='form.category' name='category' placeholder='Categoria'>
<input [(ngModel)]='form.accountId' name='accountId' placeholder='AccountId'>
<button type='submit'>Salvar</button></form>
<ul><li *ngFor='let r of items'>{{r.name}} - {{r.amount}}</li></ul></div>` })
export class RecurringsPageComponent implements OnInit {
  private service = inject(RecurringService);
  items: RecurringDto[] = [];
  form: any = { name: '', type: 'Expense', amount: 0, frequency: 'Monthly', nextRunDate: new Date().toISOString().slice(0,10), category: '', accountId: '' };
  ngOnInit() { this.load(); }
  load() { this.service.list().subscribe(v => this.items = v); }
  save() { this.service.create(this.form).subscribe(() => this.load()); }
}
