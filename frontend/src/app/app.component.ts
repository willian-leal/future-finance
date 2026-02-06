import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<div class="app-shell">
    <header class="topbar">
      <h1 class="brand">FutureFinance</h1>
      <p class="brand-subtitle">Controle financeiro com projeções e simulador de impacto</p>
      <nav class="tabs">
        <a routerLink="/" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="active" class="tab-link">Dashboard</a>
        <a routerLink="/transactions" routerLinkActive="active" class="tab-link">Transações</a>
        <a routerLink="/recurrings" routerLinkActive="active" class="tab-link">Recorrências</a>
        <a routerLink="/goals" routerLinkActive="active" class="tab-link">Metas</a>
        <a routerLink="/simulator" routerLinkActive="active" class="tab-link">Simulador</a>
      </nav>
    </header>

    <router-outlet />
  </div>`
})
export class AppComponent {}
