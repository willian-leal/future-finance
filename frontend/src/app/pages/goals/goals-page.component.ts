import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { GoalDto } from '../../models/models';

@Component({ standalone: true, imports: [CommonModule, FormsModule], template: `<div class='card'><h2>Metas</h2>
<form (ngSubmit)='save()'>
<input [(ngModel)]='form.name' name='name' placeholder='Nome'>
<input [(ngModel)]='form.targetAmount' name='targetAmount' type='number' placeholder='Valor alvo'>
<input [(ngModel)]='form.targetDate' name='targetDate' type='date'>
<input [(ngModel)]='form.priority' name='priority' type='number' min='1' max='10'>
<button type='submit'>Salvar</button></form>
<ul><li *ngFor='let g of items'>{{g.name}} - {{g.targetAmount}}</li></ul></div>` })
export class GoalsPageComponent implements OnInit {
  private service = inject(GoalService);
  items: GoalDto[] = [];
  form: any = { name: '', targetAmount: 0, targetDate: new Date().toISOString().slice(0,10), priority: 1 };
  ngOnInit() { this.load(); }
  load() { this.service.list().subscribe(v => this.items = v); }
  save() { this.service.create(this.form).subscribe(() => this.load()); }
}
