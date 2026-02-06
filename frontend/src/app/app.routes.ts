import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { TransactionsPageComponent } from './pages/transactions/transactions-page.component';
import { RecurringsPageComponent } from './pages/recurrings/recurrings-page.component';
import { GoalsPageComponent } from './pages/goals/goals-page.component';
import { SimulatorPageComponent } from './pages/simulator/simulator-page.component';

export const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'transactions', component: TransactionsPageComponent },
  { path: 'recurrings', component: RecurringsPageComponent },
  { path: 'goals', component: GoalsPageComponent },
  { path: 'simulator', component: SimulatorPageComponent }
];
