import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `<div class="container"><h1>FutureFinance</h1><nav>
  <a routerLink="/">Dashboard</a> |
  <a routerLink="/transactions">Transações</a> |
  <a routerLink="/recurrings">Recorrências</a> |
  <a routerLink="/goals">Metas</a> |
  <a routerLink="/simulator">Simulador</a>
  </nav><router-outlet /></div>`
})
export class AppComponent {}
